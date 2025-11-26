# Human-in-the-Loop AI Agent System

An intelligent AI receptionist system for Beauty & Wellness Salon that can escalate to human supervisors when it doesn't know answers and continuously learns from interactions.

## ✨ Features

- **🎙️ Voice AI Receptionist**: Real-time voice conversation with LiveKit-powered AI agent
- **AI Agent**: Intelligent voice assistant that handles customer calls
- **Knowledge Base**: Searchable database of questions and answers
- **Supervisor Dashboard**: UI for viewing and responding to escalations
- **Automatic Learning**: Supervisor answers are automatically added to knowledge base
- **Call Logging**: Track all interactions for analytics and debugging
- **Timeout Handling**: Automatic timeout for unanswered requests

## 🚀 Quick Start

**Want to try the voice feature?** See [VOICE_SETUP.md](./VOICE_SETUP.md) for complete setup instructions.


## Project Structure

\`\`\`
.
├── app/
│   ├── api/                    # API routes
│   │   ├── knowledge/          # Knowledge base endpoints
│   │   ├── help-requests/      # Escalation endpoints
│   │   └── call-logs/          # Call logging endpoints
│   ├── supervisor/             # Supervisor dashboard
│   ├── knowledge/              # Knowledge base UI
│   └── page.tsx                # Home page
├── components/                 # React components
├── lib/
│   ├── supabase/               # Supabase client utilities
│   └── types.ts                # TypeScript types
├── scripts/
│   ├── livekit_agent.py        # LiveKit AI agent
│   ├── simple_agent_test.py    # Test script
│   ├── 01-init-schema.sql      # Database schema
│   └── 02-seed-knowledge.sql   # Initial knowledge base
└── README.md
\`\`\`

## Getting Started

### 1. Database Setup

Run the SQL scripts to set up your database:

\`\`\`bash
# In v0, these scripts can be executed directly
# Or run them in your Supabase SQL editor
\`\`\`

The scripts will create:
- `help_requests` - Escalation requests from AI to supervisor
- `knowledge_base` - Q&A database for the AI
- `call_logs` - Audit trail of all calls

### 2. Install Dependencies

\`\`\`bash
# Install Node.js dependencies
npm install

# Install Python dependencies for AI agent
pip install -r scripts/requirements.txt
\`\`\`

### 3. Environment Variables

Already configured in v0 workspace:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Other Supabase credentials

For LiveKit agent, add to `.env`:
\`\`\`env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
OPENAI_API_KEY=your-openai-key
DEEPGRAM_API_KEY=your-deepgram-key
\`\`\`

### 4. Run the Application

\`\`\`bash
# Start Next.js development server
npm run dev

# In another terminal, test the agent
python scripts/simple_agent_test.py

# Or run the full LiveKit agent
python scripts/livekit_agent.py start
\`\`\`

### 5. Access the UI

- **Home**: http://localhost:3000
- **Supervisor Dashboard**: http://localhost:3000/supervisor
- **Knowledge Base**: http://localhost:3000/knowledge

## Usage

### Testing the System

1. **Run the test script**:
   \`\`\`bash
   python scripts/simple_agent_test.py
   \`\`\`

2. **Check supervisor dashboard** to see escalated questions

3. **Respond to requests** in the dashboard

4. **Verify** the answer was added to knowledge base

### Production Deployment

1. **Deploy Next.js app** to Vercel (can do from v0 UI)

2. **Set up LiveKit** account and get credentials

3. **Configure environment variables** in Vercel

4. **Run agent** on a server or container:
   \`\`\`bash
   python scripts/livekit_agent.py start
   \`\`\`

## Architecture Decisions

### Database Schema
- **help_requests**: Tracks lifecycle (pending → resolved/timeout) with automatic timeout after 30 min
- **knowledge_base**: Full-text search enabled, tracks usage count, links back to original help request
- **call_logs**: Audit trail for debugging and analytics

### Scalability
- Row Level Security (RLS) policies for multi-tenant support
- Indexed queries for fast lookups at scale
- Async API calls to prevent blocking
- Stateless design for horizontal scaling

### Error Handling
- API routes return proper HTTP status codes
- Console logging for debugging escalations
- Graceful fallbacks when services unavailable
- Timeout mechanism prevents requests from staying pending forever

### Modularity
- Separate concerns: agent logic, API routes, UI components
- Reusable Supabase client utilities
- Clean separation between LiveKit agent and web app
- Independent services (knowledge base, help requests, call logs)

## API Endpoints

### Knowledge Base
- `GET /api/knowledge` - List all entries or search with `?q=query`
- `POST /api/knowledge` - Add new entry manually
- `PATCH /api/knowledge` - Increment usage count

### Help Requests
- `GET /api/help-requests` - List requests, filter by status
- `POST /api/help-requests` - Create escalation (from AI agent)
- `POST /api/help-requests/respond` - Supervisor responds
- `POST /api/help-requests/timeout` - Check and timeout pending requests

### Call Logs
- `GET /api/call-logs` - Retrieve call history
- `POST /api/call-logs` - Log a call

## Future Enhancements

- Real Twilio integration for actual SMS notifications
- Advanced analytics dashboard
- Multi-location support
- Custom timeout periods per request type
- A/B testing for agent responses
- Voice recording storage
- Real-time supervisor notifications via WebSocket
