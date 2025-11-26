"""
LiveKit AI Agent for Salon Reception
Handles incoming calls, answers questions from knowledge base, and escalates when needed.
"""

import asyncio
import os
import logging
from typing import Optional
from dataclasses import dataclass

from dotenv import load_dotenv
load_dotenv(".env.local")
load_dotenv()

# LiveKit imports
try:
    from livekit import rtc
    from livekit.agents import JobContext, WorkerOptions, cli, llm
    from livekit.agents.voice import Agent
    from livekit.plugins import openai, deepgram, silero
except ImportError:
    print("ERROR: LiveKit SDK not installed. Install with:")
    print("pip install livekit livekit-agents livekit-plugins-openai livekit-plugins-deepgram livekit-plugins-silero")
    exit(1)

# HTTP client for API calls
import httpx

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/api")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

# Business context for Technical Support
TECH_SUPPORT_CONTEXT = """
You are a helpful Tier 1 Technical Support Specialist for "TechFlow Solutions".
Your goal is to help customers troubleshoot common technical issues with their internet service, routers, and computers.

Your responsibilities:
- patiently listen to the customer's problem
- Ask clarifying questions to diagnose the issue
- Provide step-by-step troubleshooting instructions
- If you cannot resolve the issue, say: "I'm going to escalate this to a senior specialist who can help you further."
- Be professional, empathetic, and clear

Common Issues & Solutions:
- Internet slow: Ask to restart router, check cables
- No internet: Check if modem lights are on, check ISP outage status
- Computer slow: Ask to close unused apps, check for updates, restart computer
- Printer not printing: Check paper, check connection, restart printer

Business Information:
- Name: TechFlow Solutions
- Support Hours: 24/7
- Website: www.techflow.example.com
"""


@dataclass
class CallMetadata:
    """Metadata about the current call"""
    caller_phone: str = "+1-555-UNKNOWN"
    caller_name: Optional[str] = None
    call_start: float = 0
    questions_asked: int = 0
    escalated: bool = False
    help_request_id: Optional[str] = None


class KnowledgeBase:
    """Interface to the knowledge base API"""
    
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def search(self, query: str) -> Optional[dict]:
        """Search knowledge base for relevant answer"""
        try:
            response = await self.client.get(
                f"{self.api_url}/knowledge",
                params={"q": query}
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get("entries") and len(data["entries"]) > 0:
                # Return the most relevant entry
                entry = data["entries"][0]
                
                # Increment usage count
                await self.client.patch(
                    f"{self.api_url}/knowledge",
                    json={"id": entry["id"]}
                )
                
                return entry
            return None
        except Exception as e:
            logger.error(f"Error searching knowledge base: {e}")
            return None
    
    async def close(self):
        await self.client.aclose()


class HelpRequestManager:
    """Manages escalation to human supervisor"""
    
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def create_help_request(
        self, 
        caller_phone: str, 
        caller_name: Optional[str],
        question: str,
        context: str,
        room_name: Optional[str] = None
    ) -> Optional[str]:
        """Create a help request and return the request ID"""
        try:
            response = await self.client.post(
                f"{self.api_url}/help-requests",
                json={
                    "caller_phone": caller_phone,
                    "caller_name": caller_name,
                    "question": question,
                    "context": context,
                    "room_name": room_name
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["request"]["id"]
        except Exception as e:
            logger.error(f"Error creating help request: {e}")
            return None
    
    async def close(self):
        await self.client.aclose()


class CallLogger:
    """Logs call information to the database"""
    
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def log_call(
        self,
        caller_phone: str,
        caller_name: Optional[str],
        call_duration: int,
        conversation_summary: str,
        escalated: bool,
        help_request_id: Optional[str]
    ):
        """Log call details"""
        try:
            response = await self.client.post(
                f"{self.api_url}/call-logs",
                json={
                    "caller_phone": caller_phone,
                    "caller_name": caller_name,
                    "call_duration": call_duration,
                    "conversation_summary": conversation_summary,
                    "escalated": escalated,
                    "help_request_id": help_request_id
                }
            )
            response.raise_for_status()
            logger.info(f"Call logged for {caller_phone}")
        except Exception as e:
            logger.error(f"Error logging call: {e}")
    
    async def close(self):
        await self.client.aclose()


async def entrypoint(ctx: JobContext):
    """Main entry point for the LiveKit agent"""
    
    # Initialize services
    kb = KnowledgeBase(API_BASE_URL)
    help_mgr = HelpRequestManager(API_BASE_URL)
    call_logger = CallLogger(API_BASE_URL)
    
    # Call metadata
    call_meta = CallMetadata()
    call_meta.call_start = asyncio.get_event_loop().time()
    
    # Extract caller info from room metadata if available
    room_metadata = ctx.room.metadata
    if room_metadata:
        # Parse metadata JSON if needed
        call_meta.caller_phone = room_metadata.get("caller_phone", call_meta.caller_phone)
        call_meta.caller_name = room_metadata.get("caller_name")
    
    logger.info(f"Call started from {call_meta.caller_phone}")
    
    # Connect to the room
    await ctx.connect(auto_subscribe=True)
    
    # Create the voice assistant with function calling
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=TECH_SUPPORT_CONTEXT
    )
    
    # Add knowledge base as tool/function
    async def check_knowledge_base(question: str) -> str:
        """Search the knowledge base for an answer to the customer's question"""
        logger.info(f"Checking knowledge base for: {question}")
        call_meta.questions_asked += 1
        
        entry = await kb.search(question)
        if entry:
            logger.info(f"Found answer in knowledge base: {entry['question']}")
            return entry["answer"]
        else:
            logger.info("No answer found in knowledge base - escalating")
            return None
    
    async def escalate_to_supervisor(question: str, context: str = "") -> str:
        """Escalate a question to the human supervisor when the AI doesn't know the answer"""
        logger.info(f"Escalating question: {question}")
        
        help_request_id = await help_mgr.create_help_request(
            caller_phone=call_meta.caller_phone,
            caller_name=call_meta.caller_name,
            question=question,
            context=context,
            room_name=ctx.room.name
        )
        
        if help_request_id:
            call_meta.escalated = True
            call_meta.help_request_id = help_request_id
            return "I've sent your request to a senior specialist. They will join the call shortly to assist you further. Please hold on a moment."
        else:
            return "I'm having trouble reaching a supervisor right now. Could you please call back in a few minutes?"
    
    # Create function tools
    fnc_check_kb = llm.FunctionTool.from_callable(check_knowledge_base)
    fnc_escalate = llm.FunctionTool.from_callable(escalate_to_supervisor)

    # Configure the assistant
    assistant = Agent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(
            model="gpt-4",
            temperature=0.7,
        ),
        tts=openai.TTS(voice="alloy"),
        chat_ctx=initial_ctx,
        tools=[fnc_check_kb, fnc_escalate],
        instructions=TECH_SUPPORT_CONTEXT,
    )
    
    # Start the assistant
    assistant.start(ctx.room)
    
    # Greet the caller
    await assistant.say("Hello! Thank you for calling TechFlow Solutions Support. My name is Alex. How can I help you with your technical issue today?")
    
    # Wait for the conversation to end
    await asyncio.sleep(1)  # Give time for greeting
    
    # Monitor the session
    async def monitor_session():
        """Monitor and handle the conversation session"""
        try:
            # Keep session alive
            while ctx.room.connection_state == rtc.ConnectionState.CONN_CONNECTED:
                await asyncio.sleep(1)
        except Exception as e:
            logger.error(f"Error in session monitor: {e}")
    
    await monitor_session()
    
    # Log the call when it ends
    call_duration = int(asyncio.get_event_loop().time() - call_meta.call_start)
    conversation_summary = f"Call with {call_meta.questions_asked} questions asked"
    
    await call_logger.log_call(
        caller_phone=call_meta.caller_phone,
        caller_name=call_meta.caller_name,
        call_duration=call_duration,
        conversation_summary=conversation_summary,
        escalated=call_meta.escalated,
        help_request_id=call_meta.help_request_id
    )
    
    # Cleanup
    await kb.close()
    await help_mgr.close()
    await call_logger.close()
    
    logger.info(f"Call ended. Duration: {call_duration}s, Escalated: {call_meta.escalated}")


if __name__ == "__main__":
    # Run the agent
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
