# How to Add Avatar URL Column to Supabase

## Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your project
3. Navigate to your project

## Step 2: Open SQL Editor
1. Click on "SQL Editor" in the left sidebar
2. Click "New Query"

## Step 3: Run the Migration
Copy and paste this SQL command:

```sql
ALTER TABLE ratings ADD COLUMN avatar_url TEXT;
```

Then click "Run" button.

## Step 4: Verify
After running, you should see:
- No errors
- The `avatar_url` column appears in your `ratings` table
- The column type is `text` (nullable)

## What This Does
- Adds a new column `avatar_url` to store avatar URLs
- Allows NULL values (for existing ratings without avatars)
- Stores URLs like: `https://api.dicebear.com/8.x/avataaars/svg?seed=user1`

## After Adding the Column
Your app will now:
1. Save avatar URLs when users submit ratings
2. Load avatar URLs when page refreshes
3. Display avatars persistently

## If You Get an Error
If you get "column already exists", that means the column is already there - no action needed!

## Troubleshooting
- Make sure you're in the correct Supabase project
- Make sure you're running the query in the SQL Editor (not somewhere else)
- Check that the `ratings` table exists
