# ExperimentAI - Local-First AI Science Laboratory

**PowerSync AI Hackathon Submission**

ExperimentAI is a local-first AI-powered virtual science laboratory that enables students to perform physics, electrical, and astronomy experiments with real-time AI assistance, offline capability, and collaborative features.

## 🏆 Hackathon Prize Categories

This project is eligible for:
- **Core Prizes** (1st/2nd/3rd place)
- **Best Local-First Submission** - Fully offline-capable with local SQLite + PowerSync sync
- **Best Submission Using Supabase** - Complete backend on Supabase (auth + PostgreSQL)
- **Best Submission Using Mastra** - AI agents for experiment analysis and lab assistance

## ✨ Key Features

### Local-First Architecture
- **Offline Experiments**: Run simulations without internet connectivity
- **Local SQLite Database**: All experiment data stored locally first
- **Automatic Sync**: PowerSync synchronizes with Supabase when online
- **Resilient State**: Continue working during network interruptions

### AI-Powered Lab Assistant
- **Real-time Help**: Ask questions during experiments
- **Concept Explanations**: AI explains physics, circuits, and astronomy concepts
- **Knowledge Retrieval**: Tavily integration provides authoritative scientific sources
- **Context-Aware**: Assistant references your current experiment

### Intelligent Experiment Analysis
- **Automatic Analysis**: Mastra workflow analyzes completed experiments
- **Structured Insights**: Generates observations, conclusions, and recommendations
- **Learning Progress**: AI tracks experiment history for personalized guidance
- **Error Detection**: Identifies incorrect configurations and suggests fixes

### Digital Lab Notebook
- **Automatic Entries**: Every experiment creates a structured notebook record
- **AI Explanations**: Each entry includes AI-generated analysis
- **Cross-Device Access**: Notebooks sync via PowerSync
- **Persistent History**: Track learning progress over time

### Collaborative Sessions
- **Real-time Sync**: Multiple users can observe/modify same experiment
- **Shared State**: PowerSync keeps all participants synchronized
- **Teacher Dashboard**: Educators can monitor student experiments
- **Team Learning**: Students collaborate on complex simulations

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React 18, React Three Fiber, Three.js
- **Styling**: Tailwind CSS, Framer Motion
- **Build Tool**: Vite

### PowerSync AI Hackathon Stack
- **Sync Engine**: PowerSync (SQLite ↔ Supabase PostgreSQL)
- **Backend**: Supabase (Authentication, PostgreSQL, RLS)
- **AI Framework**: Mastra (agents + workflows)
- **Knowledge Retrieval**: Tavily Search API
- **AI Model**: OpenAI GPT-4 (via Mastra)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- PowerSync account
- OpenAI API key
- Tavily API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ExperimentAI.git
cd ExperimentAI

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Database Setup

1. Create a Supabase project
2. Run the schema migration:
```bash
# In Supabase SQL Editor, run:
supabase/schema.sql
```

3. Configure PowerSync:
   - Create PowerSync instance
   - Connect to your Supabase database
   - Configure sync rules (see `docs/powersync-setup.md`)

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_POWERSYNC_URL=your_powersync_instance_url
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_TAVILY_API_KEY=your_tavily_api_key
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 How It Works

### 1. Local-First Data Flow

```
User Action → Local SQLite (PowerSync) → Supabase PostgreSQL
                    ↓
              Instant UI Update
                    ↓
         Background Sync (when online)
```

### 2. AI Experiment Analysis Workflow

```
Experiment Completed → Mastra Workflow Triggered
                            ↓
                    AI Analyzes Data
                            ↓
                  Generates Structured Insights
                            ↓
                Stores in Local DB + Syncs
                            ↓
                  Creates Notebook Entry
```

### 3. AI Assistant with Knowledge Retrieval

```
User Question → Tavily Search (scientific sources)
                      ↓
              Mastra Agent (GPT-4)
                      ↓
         Contextual Answer + Citations
```

## 🔬 Laboratory Modules

### Physics Lab
- Pendulum simulations
- Spring dynamics
- Projectile motion
- Optics experiments
- Real-time measurements with AI analysis

### Electrical Playground
- Drag-and-drop circuit builder
- Component library (batteries, resistors, LEDs, switches)
- Live circuit simulation
- AI error detection for incorrect wiring

### Astronomy Lab
- Planetary motion simulation
- Orbital mechanics
- Gravitational interactions
- AI explanations of celestial dynamics

## 🎯 PowerSync Integration Details

### Sync Streams Configuration
All tables use PowerSync Sync Streams for real-time synchronization:
- `experiments` - Experiment metadata and results
- `experiment_analyses` - AI-generated analysis
- `notebook_entries` - Lab notebook records
- `experiment_sessions` - Collaborative session state
- `session_participants` - Real-time participant tracking
- `ai_conversations` - Chat history with AI assistant

### Offline Capabilities
- Experiments run entirely in local SQLite
- All CRUD operations work offline
- Changes queued and synced when connection returns
- Conflict resolution handled by PowerSync

### Real-time Collaboration
- PowerSync broadcasts state changes to all session participants
- Sub-second latency for collaborative experiments
- Automatic reconnection and state reconciliation

## 🤖 Mastra AI Integration Details

### Lab Assistant Agent
- Powered by GPT-4 via Mastra
- Context-aware responses based on current experiment
- Integrates Tavily search for authoritative sources
- Maintains conversation history per user

### Experiment Analyzer Workflow
- Automatically triggered on experiment completion
- Analyzes parameters, measurements, and results
- Generates structured scientific summary
- Stores analysis with experiment record

### AI Memory System
- Tracks user's experiment history
- References past experiments in recommendations
- Identifies learning patterns
- Suggests related experiments

## 📊 Database Schema

See `supabase/schema.sql` for complete schema including:
- User profiles
- Experiments and results
- AI-generated analyses
- Lab notebook entries
- Collaborative sessions
- AI conversation history

All tables include Row Level Security (RLS) policies for data protection.

## 🎨 UI/UX Design

Professional SaaS-style interface with:
- Clean, minimal design system
- Consistent typography and spacing
- Real-time sync status indicators
- Responsive layout (desktop + mobile)
- Smooth animations with Framer Motion
- Accessible components

## 🔐 Security

- Supabase Authentication (email/password)
- Row Level Security (RLS) on all tables
- User data isolation
- Secure API key management
- HTTPS-only communication

## 📈 Future Enhancements

- Chemistry simulations
- Biology experiments
- VR/AR support
- Mobile apps (React Native)
- Multi-language support
- Advanced analytics dashboard
- Curriculum integration
- Teacher assessment tools

## 🏗️ Architecture Highlights

### Why PowerSync?
- **Instant UI**: No loading spinners, immediate feedback
- **Offline-First**: Labs work anywhere, even without internet
- **Real-time Collaboration**: Sub-second sync between users
- **Resilient**: Automatic conflict resolution and reconnection

### Why Mastra?
- **Structured AI Workflows**: Reliable experiment analysis pipeline
- **Agent Framework**: Easy to extend with new AI capabilities
- **Tool Integration**: Seamless Tavily search integration
- **Production-Ready**: Built for real-world AI applications

### Why Supabase?
- **Complete Backend**: Auth + Database + RLS in one platform
- **PostgreSQL**: Powerful relational database for complex queries
- **Real-time**: Native support for real-time subscriptions
- **Developer Experience**: Excellent tooling and documentation

## 📝 License

MIT License - See LICENSE file for details

## 👥 Team

[Your Name/Team Name]

## 🔗 Links

- **Live Demo**: [URL]
- **Demo Video**: [URL]
- **GitHub**: [URL]
- **Documentation**: [URL]

---

**Built for the PowerSync AI Hackathon 2026**

Demonstrating local-first architecture, AI-powered education, and collaborative learning experiences.
