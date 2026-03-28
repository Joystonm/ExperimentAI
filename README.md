# ExperimentAI


ExperimentAI is a local-first AI-powered virtual science laboratory that enables students to perform physics, electrical, and astronomy experiments with real-time AI assistance, offline capability, and collaborative features.

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
