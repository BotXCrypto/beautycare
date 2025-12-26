# Phone Sign-In Implementation - Pure & Peak

## Overview
Implemented phone number authentication for user signup. Phone number is now **required** for all new accounts to enable order confirmation calls.

## Changes Made

### 1. Frontend Updates

#### Auth Page (`src/pages/Auth.tsx`)
- Added new auth modes: `'phone-signup'` and `'phone-verify'`
- Added state for: `phone`, `otp`
- **Added 3 new forms**:
  - **Email Signup**: Includes new phone field (required) with pattern validation
  - **Phone Signup**: Accept phone number and full name, send OTP
  - **Phone Verify**: Verify 6-digit OTP received by user

#### Features:
- Phone field accepts international format: `+923001234567` or `03001234567`
- OTP input auto-formats to only digits, max 6 characters
- Toggle between email and phone signup methods
- Back button to navigate between signup modes
- Phone number is **REQUIRED** in email signup (marked with red asterisk)

### 2. Authentication Hook (`src/hooks/useAuth.tsx`)
- Updated `signUp()` to accept phone parameter
- Saves phone to user profile after email signup
- Added `signUpWithPhone()` - sends OTP via edge function
- Added `verifyPhoneOtp()` - verifies OTP and creates user account
- Both methods throw errors with user-friendly messages

### 3. Supabase Edge Functions

#### `send-phone-otp/index.ts` (NEW)
- Validates phone and fullName
- Generates 6-digit OTP
- Sets 10-minute expiry time
- Stores OTP in `phone_otp` table
- Placeholder for SMS integration (Twilio, etc.)
- **Development mode**: Returns OTP in response for testing

#### `verify-phone-otp/index.ts` (NEW)
- Validates phone and OTP
- Checks OTP expiry
- Creates user if not exists
- Creates profile with phone number
- Cleans up OTP after verification
- Creates auth session

### 4. Database Changes

#### Migration: `20251225_add_phone_auth.sql` (NEW)
- Creates `phone_otp` table with columns:
  - `id` (UUID primary key)
  - `phone` (TEXT, UNIQUE)
  - `otp` (TEXT)
  - `full_name` (TEXT)
  - `created_at` (timestamp)
  - `expires_at` (timestamp)
- Adds indexes for performance
- Configures RLS policies:
  - Anyone can insert OTP
  - Anyone can delete expired OTP
  - Authenticated users can read

### 5. User Profile Updates
- `profiles.phone` column already exists in schema
- Phone is now saved when user signs up via email
- Phone is required for phone signup method

## Sign-Up Flow

### Email + Password Method:
```
1. User enters: name, email, phone, password
2. Verification email sent
3. User verifies email
4. Account created with phone stored in profile
```

### Phone-Only Method:
```
1. User enters: name, phone
2. OTP sent to phone (10-min validity)
3. User enters 6-digit OTP
4. Account created, ready to login
5. Option to link email later
```

## Testing Instructions

### Local Development:
1. The `send-phone-otp` function returns OTP in response (dev mode)
2. Use any phone number with `+` prefix or `0` leading digits
3. Enter returned OTP to verify

### Production Setup Required:
- Configure SMS provider (Twilio, AWS SNS, etc.)
- Update `send-phone-otp/index.ts` to use SMS API
- Add provider credentials to Supabase secrets
- Remove OTP from response in dev mode

## Configuration

### Environment Variables Needed (Supabase):
```
SUPABASE_URL - Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY - Service role key for admin operations
SUPABASE_JWT_SECRET - For token generation (if needed)
```

### SMS Provider Credentials (to be added):
For production, add these to Supabase secrets:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- Or similar for your chosen SMS provider

## Files Modified/Created

### Modified:
- `src/pages/Auth.tsx` - Added phone auth forms
- `src/hooks/useAuth.tsx` - Added phone auth methods
- `supabase/migrations/20251225_add_phone_auth.sql` - Phone OTP table

### Created:
- `supabase/functions/send-phone-otp/index.ts` - OTP generation
- `supabase/functions/verify-phone-otp/index.ts` - OTP verification

## Key Features

✅ Phone required for all signups (for order confirmation calls)
✅ Supports both email and phone signup methods
✅ 6-digit OTP verification
✅ 10-minute OTP expiry
✅ Auto-cleanup of expired OTPs
✅ International phone number format support
✅ User-friendly error messages
✅ Loading states during verification
✅ Back buttons to switch signup methods
✅ Mobile responsive UI
✅ Phone saved to user profile automatically

## Next Steps

1. **SMS Integration**: Implement actual SMS sending via Twilio or similar
2. **Phone Login**: Add phone-only login (without password)
3. **Two-Factor Authentication**: Use phone OTP for 2FA
4. **Phone Number Updates**: Allow users to update phone in profile
5. **Resend OTP**: Implement resend functionality with cooldown
6. **Country Codes**: Add phone picker for international numbers

## Usage in Components

```tsx
const { signUpWithPhone, verifyPhoneOtp } = useAuth();

// Send OTP
await signUpWithPhone("+923001234567", "John Doe");

// Verify OTP
await verifyPhoneOtp("+923001234567", "123456");
```

## Error Handling

All phone auth methods include comprehensive error handling:
- Invalid phone format
- Expired OTP
- Wrong OTP code
- Network errors
- Duplicate phone numbers
- SMS sending failures (when implemented)

Errors are displayed to users via toast notifications.
