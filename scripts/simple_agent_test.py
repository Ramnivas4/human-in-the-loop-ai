"""
Simple test script to simulate the AI agent behavior without LiveKit
Tests the API integration and escalation logic
"""

import asyncio
import httpx
import time
import os
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/api")

class SimpleAgent:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.caller_phone = "+1-555-123-4567"
        self.caller_name = "Test Customer"
    
    async def search_knowledge(self, question: str):
        """Search the knowledge base"""
        try:
            response = await self.client.get(
                f"{API_BASE_URL}/knowledge",
                params={"q": question}
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get("entries") and len(data["entries"]) > 0:
                entry = data["entries"][0]
                print(f"\n✓ Found in knowledge base:")
                print(f"  Q: {entry['question']}")
                print(f"  A: {entry['answer']}")
                return entry["answer"]
            return None
        except Exception as e:
            print(f"✗ Error searching knowledge: {e}")
            return None
    
    async def escalate(self, question: str):
        """Create escalation request"""
        try:
            response = await self.client.post(
                f"{API_BASE_URL}/help-requests",
                json={
                    "caller_phone": self.caller_phone,
                    "caller_name": self.caller_name,
                    "question": question,
                    "context": "Customer called asking about this"
                }
            )
            response.raise_for_status()
            data = response.json()
            request_id = data["request"]["id"]
            print(f"\n⚠ Escalated to supervisor (Request ID: {request_id})")
            print("  Agent says: 'Let me check with my manager and get back to you.'")
            return request_id
        except Exception as e:
            print(f"✗ Error escalating: {e}")
            return None
    
    async def handle_question(self, question: str):
        """Handle a customer question"""
        print(f"\n{'='*60}")
        print(f"Customer: {question}")
        print(f"{'='*60}")
        
        # Try knowledge base first
        answer = await self.search_knowledge(question)
        
        if answer:
            print(f"\nAgent responds: {answer}")
        else:
            print("\n✗ No answer found in knowledge base")
            await self.escalate(question)
    
    async def close(self):
        await self.client.aclose()


async def main():
    print("\n" + "="*60)
    print("AI AGENT TEST - Beauty & Wellness Salon")
    print("="*60)
    print("\nThis simulates the AI agent handling customer calls")
    print("Testing knowledge base lookup and escalation flow\n")
    
    agent = SimpleAgent()
    
    # Test questions
    test_questions = [
        "What are your business hours?",
        "How much does a haircut cost?",
        "Do you offer teeth whitening?",  # This should escalate
        "Where are you located?",
        "Do you accept cryptocurrency?",  # This should escalate
    ]
    
    for question in test_questions:
        await agent.handle_question(question)
        await asyncio.sleep(1)
    
    print("\n" + "="*60)
    print("Test complete! Check the supervisor dashboard to see escalations.")
    print("="*60 + "\n")
    
    await agent.close()


if __name__ == "__main__":
    asyncio.run(main())
