# Security Measures

This document outlines the security implementations to prevent client-side tampering on the portfolio.

## Client-Side Protections

### 1. DevTools Prevention

- **Right-click disabled**: Context menu is blocked
- **Keyboard shortcuts blocked**: F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Cmd+Option+I, Cmd+Option+U
- **DevTools detection**: Monitors window size changes to detect DevTools opening
- **Console disabled**: All console methods are overridden with no-op functions

**Location**: `lib/security.js` - `initializeSecurityMeasures()`

### 2. Security Headers

- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-XSS-Protection: 1; mode=block** - Enables XSS protection
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information

**Location**: `next.config.js`

### 3. Data Validation

- **Score validation**: Checks for reasonable score ranges (0-999 for Flappy Bird)
- **Rating validation**: Validates rating values (0-5), name, message, and color format
- **Injection prevention**: Scans for suspicious patterns like script tags, event handlers

**Location**: `lib/security.js` - `validateScoreData()`

## Server-Side Protections

### 1. Score Validation API

**Endpoint**: `POST /api/validate-score`

Validates:

- Score is a valid integer between 0-999
- Username is valid (1-50 characters)
- Score is not suspiciously high compared to top scores
- Prevents obvious cheating attempts

**Location**: `app/api/validate-score/route.js`

### 2. Rating Validation API

**Endpoint**: `POST /api/validate-rating`

Validates:

- Rating is between 0-5
- Name is 1-50 characters
- Message is 1-500 characters
- Color is valid hex format
- No injection attempts (script tags, event handlers, etc.)
- **Prevents duplicate submissions** - Returns 409 Conflict if rating ID already exists in database
- **Prevents editing of already-pasted ratings** - Rejects any attempt to modify existing ratings

**Location**: `app/api/validate-rating/route.js`

### 3. Delete Rating API

**Endpoint**: `POST /api/delete-rating`

Protections:

- **Ownership verification** - Only allows deletion if user owns the rating
- **Prevents deletion of others' ratings** - Returns 403 Forbidden if attempting to delete someone else's rating
- Allows users to delete their own submitted ratings
- Checks database to verify ownership before allowing deletion

**Location**: `app/api/delete-rating/route.js`

## Implementation in Components

### FlappyBird Component

- Calls `initializeSecurityMeasures()` on mount
- Validates scores before submission
- Server-side verification of all scores

### Ratings Page

- Calls `initializeSecurityMeasures()` on mount
- Validates all rating data before submission
- Server-side verification of all ratings
- **Prevents editing of pasted ratings** - Once a rating is submitted, it cannot be edited
- **Allows users to delete only their own ratings** - Users can delete their own submitted ratings but not others'
- Blocks any attempts to modify already-pasted cards or delete others' ratings

### RatingCard Component

- Input fields are disabled (`disabled={isPasted}`) for pasted cards
- Read-only state prevents any modifications
- Stars and color selection disabled for pasted ratings
- Delete button is enabled only for own pasted ratings
- Only unpasted (draft) cards and own pasted ratings can be deleted

## Important Notes

⚠️ **Client-side security is NOT foolproof**. Determined users can still bypass these measures using:

- Browser extensions
- Network inspection tools
- Direct API calls

**The real security is server-side validation.** All critical data (scores, ratings) must be validated on the backend before being accepted and stored.

## Supabase Database Safety

The implementation ensures the Supabase database is **never corrupted** by edit attempts, duplicate submissions, or unauthorized deletions:

1. **UI-Level Prevention**:

   - Pasted cards have disabled inputs, preventing accidental edits
   - Delete button is enabled only for own pasted ratings
   - Only unpasted (draft) cards and own pasted ratings can be deleted

2. **Client-Side Logic**:

   - `updateCard()` checks if a card is already pasted and blocks updates
   - `deleteCard()` checks ownership and blocks deletion of others' ratings
   - Prevents the same rating ID from being submitted twice

3. **Duplicate Submission Prevention**:

   - Tracks submitted rating IDs in `submittedRatingIds` localStorage
   - Blocks resubmission if user deletes card and tries to paste again
   - Prevents the same rating ID from being submitted twice

4. **Server-Side Enforcement**:

   - `/api/validate-rating` checks if rating ID already exists (409 Conflict)
   - `/api/delete-rating` verifies ownership before allowing deletion (403 Forbidden for others' ratings)
   - Rejects any duplicate submissions or unauthorized deletions before they reach the database
   - Only allows INSERT of new ratings, never UPDATE of existing ones

5. **Database Integrity**:
   - Only the initial submission (unpasted → pasted) writes to Supabase
   - Subsequent edit attempts are blocked before reaching the database
   - Deletion attempts on others' ratings are blocked at UI and API level
   - Users can only delete their own submitted ratings
   - Duplicate submissions are rejected at the API level

**Attack Scenarios Now Blocked:**

```
Scenario 1: Edit existing rating
→ UI blocks (inputs disabled)
→ Client-side blocks (updateCard check)
→ API blocks (duplicate check)
→ Database never receives update

Scenario 2: Delete someone else's rating
→ UI blocks (delete button hidden for others' ratings)
→ Client-side blocks (deleteCard ownership check)
→ API blocks (403 Forbidden - ownership verification)
→ Database never receives delete request

Scenario 3: Delete and resubmit
→ Client-side blocks (submittedRatingIds check)
→ API blocks (duplicate check)
→ Database never receives duplicate

Scenario 4: Delete own rating
→ UI allows (delete button visible for own ratings)
→ Client-side allows (ownership verified)
→ API allows (ownership verified)
→ Database receives delete request only for own ratings
```

**Flow:**

- User creates unpasted card (local only)
- User fills in details and clicks "Paste" (first submission)
- `updateCard()` detects transition from unpasted→pasted
- Rating ID added to `submittedRatingIds` (permanent record)
- Supabase INSERT happens only once
- User can delete their own rating (UI shows delete button)
- Other users cannot delete this rating (UI hides delete button)
- Any edit attempts are blocked at UI and API level
- Any unauthorized deletion attempts are blocked at UI and API level
- Database never receives update or unauthorized delete requests

## Best Practices

1. **Never trust client-side data** - Always validate on the server
2. **Use checksums** - Detect tampering with data integrity checks
3. **Rate limiting** - Implement on API endpoints to prevent abuse
4. **Logging** - Log suspicious activities for monitoring
5. **Database constraints** - Add constraints at the database level

## Future Improvements

- [ ] Implement rate limiting on API endpoints
- [ ] Add request signing/verification
- [ ] Implement CAPTCHA for submissions
- [ ] Add IP-based rate limiting
- [ ] Implement user authentication
- [ ] Add audit logging for all submissions
