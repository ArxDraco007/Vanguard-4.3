/*
  # Create feedback ratings table for teacher/dorm parent reviews

  1. New Tables
    - `feedback_ratings`
      - `id` (uuid, primary key)
      - `candidate_id` (text)
      - `reviewer_id` (text, references users.id)
      - `reviewer_type` (text, teacher/dorm_parent)
      - `rating` (integer, 1-10)
      - `comments` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback_ratings` table
    - Add policies for anyone to read/write

  3. Constraints
    - Rating must be between 1 and 10
    - Reviewer type must be teacher or dorm_parent
*/

CREATE TABLE IF NOT EXISTS feedback_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id text NOT NULL,
  reviewer_id text NOT NULL,
  reviewer_type text NOT NULL,
  rating integer NOT NULL,
  comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feedback_ratings ENABLE ROW LEVEL SECURITY;

-- Add constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'feedback_ratings' AND constraint_name = 'feedback_ratings_rating_check'
  ) THEN
    ALTER TABLE feedback_ratings ADD CONSTRAINT feedback_ratings_rating_check 
    CHECK (rating >= 1 AND rating <= 10);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'feedback_ratings' AND constraint_name = 'feedback_ratings_reviewer_type_check'
  ) THEN
    ALTER TABLE feedback_ratings ADD CONSTRAINT feedback_ratings_reviewer_type_check 
    CHECK (reviewer_type = ANY (ARRAY['teacher'::text, 'dorm_parent'::text]));
  END IF;
END $$;

-- Create policies
CREATE POLICY IF NOT EXISTS "Anyone can read feedback_ratings"
  ON feedback_ratings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert feedback_ratings"
  ON feedback_ratings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update feedback_ratings"
  ON feedback_ratings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete feedback_ratings"
  ON feedback_ratings
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_feedback_ratings_updated_at
  BEFORE UPDATE ON feedback_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_ratings_candidate_reviewer 
ON feedback_ratings (candidate_id, reviewer_id, reviewer_type);