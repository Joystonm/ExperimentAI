import { column, Schema, Table } from '@powersync/web';

// Define PowerSync schema matching Supabase tables
// Note: id column is automatically created by PowerSync
const experiments = new Table({
  user_id: column.text,
  lab_type: column.text,
  experiment_type: column.text,
  title: column.text,
  parameters: column.text,
  results: column.text,
  measurements: column.text,
  status: column.text,
  created_at: column.text,
  updated_at: column.text,
  completed_at: column.text
});

const experiment_analyses = new Table({
  experiment_id: column.text,
  analysis_text: column.text,
  observations: column.text,
  conclusions: column.text,
  insights: column.text,
  generated_at: column.text
});

const notebook_entries = new Table({
  user_id: column.text,
  experiment_id: column.text,
  title: column.text,
  content: column.text,
  ai_explanation: column.text,
  graphs: column.text,
  created_at: column.text,
  updated_at: column.text
});

const experiment_sessions = new Table({
  owner_id: column.text,
  experiment_id: column.text,
  session_name: column.text,
  is_active: column.integer,
  created_at: column.text,
  ended_at: column.text
});

const session_participants = new Table({
  session_id: column.text,
  user_id: column.text,
  joined_at: column.text,
  left_at: column.text
});

const ai_conversations = new Table({
  user_id: column.text,
  experiment_id: column.text,
  messages: column.text,
  created_at: column.text,
  updated_at: column.text
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
