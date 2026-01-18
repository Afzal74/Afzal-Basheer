# Check Your Supabase Table Schema

## How to Check

1. Go to Supabase Dashboard
2. Click "Table Editor" in left sidebar
3. Click on "ratings" table
4. Look at the columns

## Expected Columns

Your `ratings` table should have these columns:

| Column Name | Type | Notes |
|------------|------|-------|
| id | text | Primary Key |
| name | text | User's name |
| message | text | User's message |
| rating | integer | 0-5 |
| color | text | Hex color |
| pasted | boolean | true/false |
| avatar_url | text | Avatar URL |
| user_id | text | User identifier |
| created_at | timestamp | Auto-generated |

## If Columns Are Missing

If you're missing any columns, run these SQL commands in the SQL Editor:

```sql
-- Add missing columns one by one
ALTER TABLE ratings ADD COLUMN user_id TEXT;
ALTER TABLE ratings ADD COLUMN avatar_url TEXT;
ALTER TABLE ratings ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
```

## Check Primary Key

Make sure `id` is set as the Primary Key:
1. Click on the `id` column
2. Check if it says "Primary Key" in the settings

## If ID is Not Primary Key

Run this SQL:
```sql
ALTER TABLE ratings ADD PRIMARY KEY (id);
```

## Common Issues

**Issue**: Data not saving
**Solution**: Make sure `id` is the Primary Key

**Issue**: Columns not showing
**Solution**: Add missing columns with ALTER TABLE commands

**Issue**: Upsert not working
**Solution**: Verify `id` is Primary Key and all columns exist
