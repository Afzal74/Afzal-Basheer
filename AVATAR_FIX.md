# Avatar URL Persistence Fix

## Problem
Avatar URLs were not persisting after page refresh because they were only stored in localStorage, not in Supabase.

## Solution
Avatar URLs are now stored in Supabase and loaded on page refresh.

## Changes Made

### 1. Ratings Page (`app/ratings/page.jsx`)
- **Load avatars from Supabase**: When loading cards, now reads `avatar_url` from database
  ```javascript
  avatarUrl: item.avatar_url || null,
  ```

- **Save avatars to Supabase**: When submitting a rating, now includes avatar URL in payload
  ```javascript
  const payload = {
    id: updatedCard.id,
    name: updatedCard.name,
    message: updatedCard.message,
    rating: updatedCard.rating,
    color: updatedCard.color,
    pasted: updatedCard.pasted,
    avatar_url: updatedCard.avatarUrl || null,
  };
  ```

### 2. RatingCard Component (`components/RatingCard.jsx`)
- **Priority loading**: Now loads avatar from card prop (Supabase) first, then falls back to localStorage
  ```javascript
  if (card.avatarUrl) {
    // Avatar is in the card data (from Supabase)
    setAvatarUrl(card.avatarUrl);
  } else {
    // Fallback to localStorage for older data
    const avatarMap = JSON.parse(localStorage.getItem("ratingAvatars") || "{}");
    if (avatarMap[card.id]) {
      setAvatarUrl(avatarMap[card.id]);
    }
  }
  ```

## Database Schema Requirement
Your Supabase `ratings` table needs an `avatar_url` column:
- Type: `text` (nullable)
- This stores the DiceBear avatar URL for each rating

## Flow
1. User creates rating and clicks "Paste"
2. Random avatar is generated from DiceBear
3. Avatar URL is saved to Supabase along with rating data
4. On page refresh, avatar URL is loaded from Supabase
5. Avatar displays correctly after refresh

## Backward Compatibility
- Old ratings without avatar URLs will still work
- System falls back to localStorage if avatar_url is null in database
- New ratings will have avatar URLs stored in Supabase
