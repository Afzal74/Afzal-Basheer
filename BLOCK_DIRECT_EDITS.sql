-- Block direct editing of flappy_scores table
-- Only allow INSERT and SELECT, block UPDATE and DELETE

-- First, enable RLS on flappy_scores table
ALTER TABLE flappy_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow inserts" ON flappy_scores;
DROP POLICY IF EXISTS "Allow reads" ON flappy_scores;
DROP POLICY IF EXISTS "Allow updates" ON flappy_scores;
DROP POLICY IF EXISTS "Allow deletes" ON flappy_scores;

-- Allow INSERT (new scores only)
CREATE POLICY "Allow inserts only" ON flappy_scores
FOR INSERT
WITH CHECK (true);

-- Allow SELECT (read scores)
CREATE POLICY "Allow reads" ON flappy_scores
FOR SELECT
USING (true);

-- BLOCK UPDATE - no one can edit existing scores
-- (This policy is intentionally NOT created, which blocks all updates)

-- BLOCK DELETE - no one can delete scores
-- (This policy is intentionally NOT created, which blocks all deletes)

-- Result: Users can only INSERT new scores and SELECT existing scores
-- Direct editing via Supabase dashboard or API will be blocked
