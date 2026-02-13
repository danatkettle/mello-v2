-- Mello v2 Database Schema
-- Run this in your Supabase SQL Editor (Project Dashboard > SQL Editor > New Query)

-- Create board_state table
CREATE TABLE board_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'single-user',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast lookup by user_id
CREATE INDEX idx_board_state_user_id ON board_state(user_id);

-- Insert default empty board state
INSERT INTO board_state (user_id, data) VALUES (
  'single-user',
  '{
    "cards": {},
    "columns": {},
    "columnOrder": [],
    "calendarEntries": {}
  }'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE board_state ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for single user (no auth required)
CREATE POLICY "Allow all operations for single user"
  ON board_state
  FOR ALL
  USING (user_id = 'single-user')
  WITH CHECK (user_id = 'single-user');

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_board_state_updated_at
  BEFORE UPDATE ON board_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
