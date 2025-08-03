/*
  # Create sessions and documents tables

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `checklist` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `documents`
      - `id` (uuid, primary key)
      - `module_id` (text)
      - `title` (text)
      - `description` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `uploaded_by` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  checklist jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  file_url text NOT NULL,
  file_type text DEFAULT 'document',
  uploaded_by text DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Anyone can read sessions"
  ON sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert sessions"
  ON sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
  ON sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete sessions"
  ON sessions
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create policies for documents
CREATE POLICY "Anyone can read documents"
  ON documents
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert documents"
  ON documents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update documents"
  ON documents
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete documents"
  ON documents
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();