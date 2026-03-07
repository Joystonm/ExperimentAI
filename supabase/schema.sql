-- ExperimentAI Database Schema for Supabase + PowerSync

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiments table
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lab_type TEXT NOT NULL, -- 'physics', 'electrical', 'astronomy'
  experiment_type TEXT NOT NULL, -- 'pendulum', 'circuit', 'orbital', etc.
  title TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  results JSONB DEFAULT '{}',
  measurements JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft', -- 'draft', 'running', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Experiment analysis (AI-generated)
CREATE TABLE experiment_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  observations JSONB DEFAULT '[]',
  conclusions JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab notebook entries
CREATE TABLE notebook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  ai_explanation TEXT,
  graphs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaborative sessions
CREATE TABLE experiment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Session participants
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES experiment_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(session_id, user_id)
);

-- AI assistant conversations
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experiment_id UUID REFERENCES experiments(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_experiments_user_id ON experiments(user_id);
CREATE INDEX idx_experiments_created_at ON experiments(created_at DESC);
CREATE INDEX idx_notebook_entries_user_id ON notebook_entries(user_id);
CREATE INDEX idx_experiment_sessions_owner_id ON experiment_sessions(owner_id);
CREATE INDEX idx_session_participants_session_id ON session_participants(session_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Experiments policies
CREATE POLICY "Users can view own experiments" ON experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiments" ON experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiments" ON experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiments" ON experiments FOR DELETE USING (auth.uid() = user_id);

-- Experiment analyses policies
CREATE POLICY "Users can view analyses of own experiments" ON experiment_analyses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM experiments WHERE experiments.id = experiment_id AND experiments.user_id = auth.uid()));

-- Notebook policies
CREATE POLICY "Users can view own notebook entries" ON notebook_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notebook entries" ON notebook_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notebook entries" ON notebook_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notebook entries" ON notebook_entries FOR DELETE USING (auth.uid() = user_id);

-- Session policies
CREATE POLICY "Users can view sessions they own or participate in" ON experiment_sessions FOR SELECT 
  USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM session_participants WHERE session_id = experiment_sessions.id AND user_id = auth.uid()));

CREATE POLICY "Users can create sessions" ON experiment_sessions FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own sessions" ON experiment_sessions FOR UPDATE USING (auth.uid() = owner_id);

-- Session participants policies
CREATE POLICY "Users can view participants in their sessions" ON session_participants FOR SELECT 
  USING (EXISTS (SELECT 1 FROM experiment_sessions WHERE experiment_sessions.id = session_id AND (experiment_sessions.owner_id = auth.uid() OR auth.uid() = user_id)));

-- AI conversations policies
CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notebook_entries_updated_at BEFORE UPDATE ON notebook_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
