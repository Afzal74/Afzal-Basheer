# Debug: Why Data Isn't Saving to Supabase

## Step 1: Check Browser Console for Errors

1. Open your app in browser
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Create a new rating and click "Paste"
5. Look for error messages like:
   - "Error saving rating: ..."
   - "Failed to save rating to Supabase: ..."

## Step 2: Check Supabase Permissions

Your Supabase table might have Row Level Security (RLS) enabled. Check:

1. Go to Supabase Dashboard
2. Click "Authentication" → "Policies"
3. Look for the "ratings" table
4. If RLS is enabled, you need policies that allow INSERT

## Step 3: Verify Table Structure

Run this SQL to see your table structure:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ratings'
ORDER BY ordinal_position;
```

You should see columns like:
- id (text)
- name (text)
- message (text)
- rating (integer)
- color (text)
- pasted (boolean)
- avatar_url (text)
- user_id (text)
- created_at (timestamp)

## Step 4: Test Direct Insert

Try inserting a test record directly in SQL Editor:

```sql
INSERT INTO ratings (id, name, message, rating, color, pasted, avatar_url, user_id)
VALUES ('test-123', 'Test User', 'Test message', 5, '#ef4444', true, 'https://api.dicebear.com/8.x/avataaars/svg?seed=test', 'user-123');
```

If this works, the table is fine. If it fails, check the error message.

## Step 5: Check RLS Policies

If RLS is enabled, you need INSERT policy. Run this:

```sql
-- Disable RLS temporarily to test
ALTER TABLE ratings DISABLE ROW LEVEL SECURITY;
```

Then try creating a rating again. If it works, RLS is the issue.

## Step 6: Re-enable RLS with Proper Policy

If RLS was the issue, re-enable it with a policy:

```sql
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all inserts" ON ratings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all selects" ON ratings
FOR SELECT
USING (true);
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "permission denied" | Disable RLS or add INSERT policy |
| "column does not exist" | Add missing columns with ALTER TABLE |
| "duplicate key value" | ID already exists, use different ID |
| "null value in column" | Make sure all required fields have values |

## Check What's Actually Being Sent

Add this to your browser console to see the payload:

```javascript
// In browser console, after clicking Paste:
// Look for "Error saving rating:" message
// It will show the exact error from Supabase
```

## Next Steps

1. Check browser console for errors
2. Run the test SQL INSERT
3. Check if RLS is enabled
4. Let me know what error you see
