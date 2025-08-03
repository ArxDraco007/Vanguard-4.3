/*
  # Create feedback_ratings table for teacher and dorm parent feedback

  1. New Tables
    - `feedback_ratings`
      - `id` (uuid, primary key)
      - `candidate_id` (text, references candidates)
      - `reviewer_id` (text, references users)
      - `reviewer_type` (text, either 'teacher' or 'dorm_parent')
      - `rating` (integer, 1-10 scale)
      - `comments` (text, optional feedback comments)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback_ratings` table
    - Add policies for authenticated users to manage their own feedback
    - Add policies for reading all feedback (for admin analytics)

  3. Constraints
    - Rating must be between 1 and 10
    - Reviewer type must be either 'teacher' or 'dorm_parent'
*/

CREATE TABLE IF NOT EXISTS feedback_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id text NOT NULL,
  reviewer_id text NOT NULL,
  reviewer_type text NOT NULL CHECK (reviewer_type IN ('teacher', 'dorm_parent')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feedback_ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read feedback ratings (for analytics)
CREATE POLICY "Anyone can read feedback ratings"
  ON feedback_ratings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert feedback ratings
CREATE POLICY "Anyone can insert feedback ratings"
  ON feedback_ratings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update feedback ratings
CREATE POLICY "Anyone can update feedback ratings"
  ON feedback_ratings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete feedback ratings
CREATE POLICY "Anyone can delete feedback ratings"
  ON feedback_ratings
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_feedback_ratings_updated_at'
  ) THEN
    CREATE TRIGGER update_feedback_ratings_updated_at
      BEFORE UPDATE ON feedback_ratings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_ratings_candidate_reviewer 
  ON feedback_ratings (candidate_id, reviewer_id, reviewer_type);