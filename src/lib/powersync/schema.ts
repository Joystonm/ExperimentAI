import { Column, ColumnType, Index, IndexedColumn, Schema, Table } from '@journeyapps/powersync-sdk-web';

// Define PowerSync schema matching Supabase tables
const experiments = new Table({
  id: ColumnType.TEXT,
  user_id: ColumnType.TEXT,
  lab_type: ColumnType.TEXT,
  experiment_type: ColumnType.TEXT,
  title: ColumnType.TEXT,
  parameters: ColumnType.TEXT, // JSON stored as TEXT
  results: ColumnType.TEXT,
  measurements: ColumnType.TEXT,
  status: ColumnType.TEXT,
  created_at: ColumnType.TEXT,
  updated_at: ColumnType.TEXT,
  completed_at: ColumnType.TEXT
}, { indexes: [new Index({ name: 'user_idx', columns: [new IndexedColumn({ name: 'user_id' })] })] });

const experiment_analyses = new Table({
  id: ColumnType.TEXT,
  experiment_id: ColumnType.TEXT,
  analysis_text: ColumnType.TEXT,
  observations: ColumnType.TEXT,
  conclusions: ColumnType.TEXT,
  insights: ColumnType.TEXT,
  generated_at: ColumnType.TEXT
});

const notebook_entries = new Table({
  id: ColumnType.TEXT,
  user_id: ColumnType.TEXT,
  experiment_id: ColumnType.TEXT,
  title: ColumnType.TEXT,
  content: ColumnType.TEXT,
  ai_explanation: ColumnType.TEXT,
  graphs: ColumnType.TEXT,
  created_at: ColumnType.TEXT,
  updated_at: ColumnType.TEXT
}, { indexes: [new Index({ name: 'user_idx', columns: [new IndexedColumn({ name: 'user_id' })] })] });

const experiment_sessions = new Table({
  id: ColumnType.TEXT,
  owner_id: ColumnType.TEXT,
  experiment_id: ColumnType.TEXT,
  session_name: ColumnType.TEXT,
  is_active: ColumnType.INTEGER, // Boolean as INTEGER
  created_at: ColumnType.TEXT,
  ended_at: ColumnType.TEXT
});

const session_participants = new Table({
  id: ColumnType.TEXT,
  session_id: ColumnType.TEXT,
  user_id: ColumnType.TEXT,
  joined_at: ColumnType.TEXT,
  left_at: ColumnType.TEXT
});

const ai_conversations = new Table({
  id: ColumnType.TEXT,
  user_id: ColumnType.TEXT,
  experiment_id: ColumnType.TEXT,
  messages: ColumnType.TEXT,
  created_at: ColumnType.TEXT,
  updated_at: ColumnType.TEXT
});

export const AppSchema = new Schema({
  experiments,
  experiment_analyses,
  notebook_entries,
  experiment_sessions,
  session_participants,
  ai_conversations
});

export type Database = (typeof AppSchema)['types'];
export type Experiment = Database['experiments'];
export type ExperimentAnalysis = Database['experiment_analyses'];
export type NotebookEntry = Database['notebook_entries'];
export type ExperimentSession = Database['experiment_sessions'];
export type SessionParticipant = Database['session_participants'];
export type AIConversation = Database['ai_conversations'];
