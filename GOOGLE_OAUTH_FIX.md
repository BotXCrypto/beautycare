# Google OAuth Error - Quick Fix Guide

## Error Details
```
error=server_error
error_code=unexpected_failure
error_description=Unable to exchange external code
```

## Root Cause
The Google OAuth redirect URI was misconfigured. The OAuth callback wasn't properly registered in:
- Google Cloud Console
- Supabase Authentication Settings

## What Was Fixed ✅

Changed redirect URL from:
```
https://pureandpeak.lovable.app/auth
```

To:
```
https://pureandpeak.lovable.app/
```

This prevents circular redirects and aligns with standard OAuth practices.

---

## Complete Setup Instructions

### 1. Verify Supabase Configuration

Go to: **Supabase Dashboard** → Your Project → **Authentication** → **Providers**

#### Google Provider Settings:
- [ ] **Enabled**: Toggle ON
- [ ] **Client ID**: Filled from Google Console
- [ ] **Client Secret**: Filled from Google Console

#### Look for "Authorized redirect URIs" or "OAuth Redirect URLs"
Should include:
```
https://pureandpeak.lovable.app/
https://[project-id].supabase.co/auth/v1/callback
```

---

### 2. Update Google Console

Go to: [Google Cloud Console](https://console.cloud.google.com/)

#### Find your OAuth App:
1. Click project dropdown → Select correct project
2. **APIs & Services** → **Credentials**
3. Find "OAuth 2.0 Client IDs" → "Web application"
4. Click to edit

#### Add Authorized Redirect URIs:
Click **+ Add URI** and add these:
```
https://pureandpeak.lovable.app/
https://pureandpeak.lovable.app
https://[project-id].supabase.co/auth/v1/callback
```

Replace `[project-id]` with your actual Supabase project ID (found in project settings).

#### Remove any incorrect URIs:
❌ Remove: `https://pureandpeak.lovable.app/auth`
❌ Remove: `http://localhost:3000` (if still there)

#### Save changes
Google needs 5-10 minutes to propagate changes.

---

### 3. Test the Fix

1. Clear browser cookies/cache (or use private/incognito window)
2. Go to https://pureandpeak.lovable.app/auth
3. Click "Continue with Google"
4. Sign in with your Google account
5. Should be redirected to home page successfully

---

## Troubleshooting

### Still Getting Error?

**Step 1**: Verify Client ID and Secret
```bash
# In Supabase, check that these match your Google Console
- Client ID should start with: [numbers].apps.googleusercontent.com
- Client Secret should be filled (not empty)
```

**Step 2**: Check Redirect URI Format
```
✅ Correct: https://pureandpeak.lovable.app/
❌ Wrong: https://pureandpeak.lovable.app/auth
❌ Wrong: http://pureandpeak.lovable.app/ (missing https)
```

**Step 3**: Verify Domain Verification
- Google may require domain verification
- Check: **Google Console** → **OAuth consent screen**
- If status is "Testing", switch to "Production" mode
- May need to verify ownership of pureandpeak.lovable.app

**Step 4**: Check CORS Configuration
Supabase should have CORS allowed for:
```
https://pureandpeak.lovable.app
```

---

## Alternative: Disable Google OAuth Temporarily

If you need users to sign up immediately, they can use:
- ✅ Email + Password signup
- ✅ Phone-only signup (new feature)

Users can link Google account later after email verification.

---

## Code Changes Made

**File**: `src/hooks/useAuth.tsx`

**Before**:
```typescript
redirectTo: `${window.location.origin}/auth`
```

**After**:
```typescript
redirectTo: `${window.location.origin}/`
scopes: 'profile email'
```

This aligns with OAuth best practices and Supabase's expected callback pattern.

---

## Prevention Tips

✅ Always use trailing slash: `https://domain.com/`
✅ Use HTTPS in production (not HTTP)
✅ Keep Google Console and Supabase settings in sync
✅ Test in private/incognito window to clear stale cookies
✅ Allow 10 minutes after changing Google settings
✅ Use Supabase test user feature for development

---

## Still Not Working?

Try these additional steps:

1. **Refresh Supabase Settings**:
   - Disable Google provider
   - Save
   - Wait 30 seconds
   - Re-enable and fill credentials again

2. **Check OAuth Consent Screen**:
   - Google Console → OAuth consent screen
   - Ensure app name is set
   - Authorized domain includes your domain
   - Scopes include "email" and "profile"

3. **Create New Credentials** (if all else fails):
   - Delete old OAuth 2.0 credentials
   - Create new Web application credentials
   - Add all redirect URIs before saving
   - Copy new Client ID and Secret to Supabase

4. **Contact Lovable Support**:
   - Provide error URL
   - Share your domain
   - They can check their OAuth app configuration

---

## Monitoring Going Forward

Check for similar errors:
- Monitor Supabase logs regularly
- Set up error alerts in your analytics
- Test Google auth weekly
- Keep credentials rotated
- Document all redirect URIs in a checklist
