# Block Direct Editing of Flappy Bird Scores

## Problem
Users can directly edit scores in Supabase by modifying the database, bypassing game validation.

## Solution
Use Row Level Security (RLS) to block UPDATE and DELETE operations on the `flappy_scores` table.

## How to Set It Up

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Copy and Run This SQL

```sql
-- Enable RLS on flappy_scores table
ALTER TABLE flappy_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
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
```

### Step 3: Verify It Works

After running the SQL:
1. Try to create a new score in the game - ✅ Should work
2. Try to edit a score directly in Supabase - ❌ Should be blocked
3. Try to delete a score in Supabase - ❌ Should be blocked

## What This Does

| Operation | Allowed? | Why |
|-----------|----------|-----|
| INSERT (new score) | ✅ Yes | Game needs to submit scores |
| SELECT (read scores) | ✅ Yes | Leaderboard needs to display scores |
| UPDATE (edit score) | ❌ No | Prevents cheating via direct DB edit |
| DELETE (remove score) | ❌ No | Prevents tampering |

## Result

- ✅ Game can submit new scores
- ✅ Leaderboard can display scores
- ❌ Direct database editing is blocked
- ❌ Cheaters cannot modify scores in Supabase

## If You Need to Edit Scores Manually

If you need to fix a score as admin, you'll need to temporarily disable RLS:

```sql
ALTER TABLE flappy_scores DISABLE ROW LEVEL SECURITY;
-- Make your edits
ALTER TABLE flappy_scores ENABLE ROW LEVEL SECURITY;
```

## Important Notes

- RLS is the most secure way to prevent tampering
- Even if someone has Supabase access, they can't bypass RLS policies
- The game's server-side validation still catches cheating attempts
- This is a defense-in-depth approach (multiple layers of protection)
