-- VibeOS Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- VIBE PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS vibe_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  analytical INT DEFAULT 50 CHECK (analytical BETWEEN 0 AND 100),
  creative INT DEFAULT 50 CHECK (creative BETWEEN 0 AND 100),
  empathetic INT DEFAULT 50 CHECK (empathetic BETWEEN 0 AND 100),
  social INT DEFAULT 50 CHECK (social BETWEEN 0 AND 100),
  ambitious INT DEFAULT 50 CHECK (ambitious BETWEEN 0 AND 100),
  calm INT DEFAULT 50 CHECK (calm BETWEEN 0 AND 100),
  vibe_score INT DEFAULT 50 CHECK (vibe_score BETWEEN 0 AND 100),
  vibe_label TEXT DEFAULT 'Balanced',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MOOD LOGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'low', 'bad')),
  mood_score INT CHECK (mood_score BETWEEN 1 AND 5),
  vibe_score INT CHECK (vibe_score BETWEEN 0 AND 100),
  insight TEXT,
  focus INT DEFAULT 50,
  energy INT DEFAULT 50,
  social INT DEFAULT 50,
  calm INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MATCHES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INT CHECK (score BETWEEN 0 AND 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'declined')),
  compatibility_reasons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id)
);

-- =====================
-- CHAT SESSIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_created_at ON mood_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_vibe_profiles_user_id ON vibe_profiles(user_id);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Users can read public profiles, write their own
CREATE POLICY "Public profiles are viewable" ON users
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Vibe profiles
CREATE POLICY "Public vibe profiles viewable" ON vibe_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = vibe_profiles.user_id AND users.is_public = true)
  );

CREATE POLICY "Users manage own vibe profile" ON vibe_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Mood logs - private by default
CREATE POLICY "Users manage own mood logs" ON mood_logs
  FOR ALL USING (auth.uid() = user_id);

-- Matches
CREATE POLICY "Users view own matches" ON matches
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "Users create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own matches" ON matches
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Chat sessions
CREATE POLICY "Users view own chats" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "Users manage own chats" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- =====================
-- FUNCTIONS
-- =====================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vibe_profiles_updated_at
  BEFORE UPDATE ON vibe_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
