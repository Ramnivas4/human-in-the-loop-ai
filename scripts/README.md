# AI Agent Scripts

This directory contains the LiveKit AI agent and testing utilities for the human-in-the-loop system.

## Files

- **livekit_agent.py** - Main LiveKit AI agent that handles phone calls
- **simple_agent_test.py** - Simple test script to verify API integration without LiveKit
- **requirements.txt** - Python dependencies

## Setup

1. Install Python dependencies:
\`\`\`bash
pip install -r scripts/requirements.txt
\`\`\`

2. Set up environment variables (create a `.env` file in project root):
\`\`\`env
# LiveKit credentials (get free account at livekit.io)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# OpenAI API key for LLM
OPENAI_API_KEY=your-openai-key

# Deepgram API key for speech-to-text
DEEPGRAM_API_KEY=your-deepgram-key

# API endpoints
API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
\`\`\`

## Testing Without LiveKit

To test the agent logic without setting up LiveKit:

\`\`\`bash
# Make sure your Next.js dev server is running first
npm run dev

# Then run the simple test
python scripts/simple_agent_test.py
\`\`\`

This will simulate customer questions and test both knowledge base lookup and escalation.

## Running the LiveKit Agent

Once you have LiveKit credentials:

\`\`\`bash
python scripts/livekit_agent.py start
\`\`\`

The agent will:
1. Connect to LiveKit and wait for incoming calls
2. Greet callers and answer their questions
3. Search the knowledge base for answers
4. Escalate to supervisor when it doesn't know
5. Log all calls to the database

## How It Works

1. **Call Received** - Agent greets the caller
2. **Question Asked** - Agent searches knowledge base
3. **Answer Found** - Agent responds immediately
4. **No Answer** - Agent says "Let me check with my manager" and creates help request
5. **Supervisor Responds** - System texts the caller (simulated via console)
6. **Knowledge Updated** - Answer is added to knowledge base for future calls

## Monitoring

- Check console logs for real-time agent activity
- View supervisor dashboard at http://localhost:3000/supervisor
- Check knowledge base at http://localhost:3000/knowledge
