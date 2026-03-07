# ExperimentAI Implementation Guide

## Architecture Overview

ExperimentAI is built on a local-first architecture where data is stored in a local SQLite database and synchronized with Supabase PostgreSQL via PowerSync.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Physics Lab │  │  Electrical  │  │  Astronomy   │      │
│  │              │  │  Playground  │  │     Lab      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           AI Lab Assistant (Mastra + Tavily)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PowerSync Sync Engine                     │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  Local SQLite DB     │ ◄──► │  Supabase PostgreSQL │    │
│  │  (Offline-capable)   │      │  (Cloud backend)     │    │
│  └──────────────────────┘      └──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. PowerSync Integration

**Location**: `src/lib/powersync/`

**Files**:
- `schema.ts` - Defines local SQLite schema matching Supabase tables
- `db.ts` - Initializes PowerSync database and connector

**Key Features**:
- Automatic bidirectional sync between SQLite and PostgreSQL
- Offline queue for pending changes
- Conflict resolution
- Real-time updates

**Usage Example**:
```javascript
import { usePowerSync } from '../context/PowerSyncContext';

const { db, isConnected, isSyncing } = usePowerSync();

// Query local database
const experiments = await db.getAll(
  'SELECT * FROM experiments WHERE user_id = ?',
  [userId]
);

// Insert data (syncs automatically)
await db.execute(
  'INSERT INTO experiments (...) VALUES (...)',
  [...]
);
```

### 2. Mastra AI Agents

**Location**: `src/lib/mastra/agents.ts`

**Components**:
- **Lab Assistant Agent**: Answers questions, explains concepts
- **Experiment Analyzer Workflow**: Analyzes completed experiments
- **Error Detection**: Identifies configuration issues

**Usage Example**:
```javascript
import { askLabAssistant, experimentAnalyzerWorkflow } from '../lib/mastra/agents';

// Ask the assistant
const response = await askLabAssistant(
  "Explain Newton's laws of motion",
  experimentContext
);

// Analyze experiment
const analysis = await experimentAnalyzerWorkflow.execute({
  experimentData: {
    lab_type: 'physics',
    experiment_type: 'pendulum',
    parameters: { length: 1.0, mass: 0.5 },
    measurements: [...]
  }
});
```

### 3. Tavily Knowledge Retrieval

**Location**: `src/lib/mastra/agents.ts` (integrated)

**Purpose**: Fetches authoritative scientific sources to enhance AI responses

**Usage**:
```javascript
import { searchScientificKnowledge } from '../lib/mastra/agents';

const sources = await searchScientificKnowledge(
  "gravitational force formula"
);
// Returns: [{ title, url, content }, ...]
```

### 4. Experiment Management

**Location**: `src/hooks/useExperiments.js`

**Functions**:
- `createExperiment()` - Create new experiment (stored locally)
- `updateExperiment()` - Update experiment data
- `completeExperiment()` - Mark complete and trigger AI analysis
- `getExperiments()` - Fetch user's experiments
- `createNotebookEntry()` - Add lab notebook entry

**Workflow**:
```javascript
const { createExperiment, completeExperiment } = useExperiments();

// 1. Create experiment
const experiment = await createExperiment({
  lab_type: 'physics',
  experiment_type: 'pendulum',
  title: 'Pendulum Period vs Length',
  parameters: { length: 1.0, mass: 0.5 }
});

// 2. Run simulation and collect data
// ... user interacts with simulation ...

// 3. Complete and analyze
await completeExperiment(experiment.id);
// This triggers:
// - AI analysis workflow
// - Notebook entry creation
// - Sync to Supabase
```

## Data Flow

### Creating an Experiment

```
User Action
    ↓
createExperiment()
    ↓
INSERT INTO local SQLite
    ↓
PowerSync queues upload
    ↓
Sync to Supabase (when online)
    ↓
UI updates instantly (no waiting)
```

### Completing an Experiment

```
User clicks "Complete"
    ↓
completeExperiment()
    ↓
Update status in SQLite
    ↓
Trigger Mastra workflow
    ↓
AI analyzes experiment data
    ↓
Generate structured insights
    ↓
Store analysis in SQLite
    ↓
Create notebook entry
    ↓
PowerSync syncs all changes
```

### AI Assistant Interaction

```
User asks question
    ↓
Tavily searches scientific sources
    ↓
Mastra agent receives:
  - User question
  - Search results
  - Experiment context
    ↓
GPT-4 generates response
    ↓
Return answer + citations
    ↓
Display in chat UI
```

## Database Schema

### Key Tables

**experiments**
- Stores experiment metadata, parameters, results
- Synced per user via PowerSync
- Triggers AI analysis on completion

**experiment_analyses**
- AI-generated analysis of experiments
- Linked to experiments table
- Contains observations, conclusions, insights

**notebook_entries**
- Lab notebook records
- Includes AI explanations
- Synced across devices

**experiment_sessions**
- Collaborative experiment sessions
- Real-time sync for multi-user experiments

**ai_conversations**
- Chat history with AI assistant
- Persisted across sessions

## UI Components

### AILabAssistant

**Location**: `src/components/AILabAssistant.jsx`

**Features**:
- Floating chat window
- Message history
- Source citations
- Context-aware responses

**Integration**:
```javascript
import AILabAssistant from '../components/AILabAssistant';

<AILabAssistant
  experimentContext={currentExperiment}
  isOpen={isAssistantOpen}
  onClose={() => setIsAssistantOpen(false)}
/>
```

### SyncStatusIndicator

**Location**: `src/components/SyncStatusIndicator.jsx`

**States**:
- 🟢 Green: Connected and synced
- 🟡 Yellow: Syncing in progress
- ⚪ Gray: Offline mode

### LabNotebook

**Location**: `src/pages/LabNotebook.jsx`

**Features**:
- List of all experiment records
- AI-generated analysis display
- Graphs and visualizations
- Cross-device access

## Offline Capabilities

### What Works Offline

✅ Run all experiments
✅ Create and modify experiments
✅ View existing data
✅ AI assistant (if using local models)
✅ Lab notebook access

### What Requires Connection

❌ Initial data sync
❌ Tavily knowledge retrieval
❌ OpenAI API calls (unless using local models)
❌ Collaborative sessions

### Offline-to-Online Transition

1. User works offline → data stored in SQLite
2. Connection restored → PowerSync detects
3. Queued changes uploaded automatically
4. Server changes downloaded
5. UI updates with synced data

## AI Integration Details

### Mastra Configuration

**Model**: GPT-4 via OpenAI API

**Agent Instructions**:
- Expert science educator persona
- Clear, student-friendly explanations
- Reference specific experiment data
- Provide educational context

**Workflow Execution**:
- Triggered automatically on experiment completion
- Analyzes parameters, measurements, results
- Generates structured output (observations, conclusions, insights)

### Tavily Integration

**Search Parameters**:
- `search_depth`: 'advanced'
- `include_domains`: Educational sites (Wikipedia, Khan Academy, etc.)
- `max_results`: 3

**Usage Pattern**:
1. User asks question
2. Search Tavily for relevant sources
3. Pass sources to Mastra agent
4. Agent synthesizes answer with citations

## Security

### Authentication Flow

```
User signs up/in
    ↓
Supabase Auth creates session
    ↓
JWT token generated
    ↓
PowerSync uses JWT for sync auth
    ↓
RLS policies enforce data isolation
```

### Row Level Security

All tables have RLS policies:
- Users can only access their own data
- Shared sessions accessible to participants
- AI conversations private to user

### API Key Management

- All keys in environment variables
- Never exposed in client code
- Validated on server side

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX idx_experiments_user_id ON experiments(user_id);
CREATE INDEX idx_experiments_created_at ON experiments(created_at DESC);
CREATE INDEX idx_notebook_entries_user_id ON notebook_entries(user_id);
```

### Sync Optimization

- Only sync user's own data
- Paginate large result sets
- Use incremental sync (PowerSync handles this)

### AI Response Caching

Consider caching common questions:
```javascript
const cache = new Map();

async function getCachedResponse(question) {
  if (cache.has(question)) {
    return cache.get(question);
  }
  const response = await askLabAssistant(question);
  cache.set(question, response);
  return response;
}
```

## Testing

### Local Development

```bash
# Start dev server
npm run dev

# Test offline mode
# 1. Open DevTools → Network tab
# 2. Set throttling to "Offline"
# 3. Verify experiments still work
# 4. Re-enable network
# 5. Verify sync indicator shows "Syncing..."
```

### PowerSync Testing

```javascript
// Check sync status
const { isConnected, isSyncing } = usePowerSync();
console.log('PowerSync status:', { isConnected, isSyncing });

// Monitor sync events
powerSyncDb.registerListener({
  statusChanged: (status) => {
    console.log('Sync status changed:', status);
  }
});
```

### AI Testing

```javascript
// Test lab assistant
const response = await askLabAssistant(
  "What is the formula for kinetic energy?"
);
console.log('AI Response:', response);

// Test experiment analyzer
const analysis = await experimentAnalyzerWorkflow.execute({
  experimentData: mockExperimentData
});
console.log('Analysis:', analysis);
```

## Deployment

### Environment Setup

1. Create Supabase project
2. Apply database schema
3. Create PowerSync instance
4. Configure sync rules
5. Set environment variables
6. Deploy frontend

### Production Checklist

- [ ] Database schema applied
- [ ] RLS policies enabled
- [ ] PowerSync sync rules deployed
- [ ] Environment variables set
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled

## Troubleshooting

### Common Issues

**PowerSync won't connect**
- Check VITE_POWERSYNC_URL is correct
- Verify Supabase auth is working
- Check browser console for errors

**AI responses failing**
- Verify VITE_OPENAI_API_KEY is set
- Check API quota/billing
- Review error messages in console

**Sync not working**
- Ensure sync rules are deployed
- Check RLS policies allow access
- Verify user is authenticated

**Offline mode not working**
- Confirm PowerSync is initialized
- Check SQLite database exists
- Verify service worker (if using)

## Next Steps

### Enhancements

1. **Collaborative Sessions**: Implement real-time multi-user experiments
2. **Advanced AI**: Add experiment suggestions based on learning history
3. **Mobile App**: Build React Native version with same sync
4. **Local Models**: Integrate local LLMs for fully offline AI
5. **Analytics**: Add experiment analytics dashboard

### Optimization

1. Implement AI response caching
2. Add database query optimization
3. Lazy load experiment data
4. Optimize 3D rendering performance
5. Add progressive web app features

## Resources

- [PowerSync Documentation](https://docs.powersync.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Mastra Documentation](https://mastra.ai/docs)
- [Tavily API Documentation](https://tavily.com/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
