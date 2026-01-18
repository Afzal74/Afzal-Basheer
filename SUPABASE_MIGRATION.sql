-- Add avatar_url column to ratings table if it doesn't exist
ALTER TABLE ratings ADD COLUMN avatar_url TEXT;

-- This column will store the DiceBear avatar URL for each rating
-- Example: https://api.dicebear.com/8.x/avataaars/svg?seed=user1
