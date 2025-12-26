# Phone Sign-In UI Changes

## Signup Flow - User Interface

### Main Signup Form (Email Method)
```
Full Name: [________________]
Email: [________________]
Phone Number *: [+923001234567] ← NEW & REQUIRED
Password: [________________] (min 6 chars)

[Sign Up with Email] button
────────────────────────────── OR ────────────────────────────────
[Sign Up with Phone] button

"A verification email will be sent to confirm your account"
```

### Phone Signup Form
```
Full Name: [________________]
Phone Number *: [+923001234567]

[Send Verification Code] button
[Back to Email Sign Up] button

"We'll send a verification code to this number"
```

### Phone Verification Form
```
Verification code sent to
+923001234567

Verification Code: [000000]
(6-digit input, centers text)

[Verify & Create Account] button (disabled until 6 digits entered)
[Didn't receive code? Resend] button

"Enter the 6-digit code"
```

## Key Changes from Previous Design

### Before:
- ❌ No phone number field
- ❌ Email was only required field for signup
- ❌ Only email verification method

### After:
- ✅ Phone number is REQUIRED for all signups
- ✅ Two signup methods available:
  1. Email + Password + Phone
  2. Phone-only with OTP
- ✅ International phone format support
- ✅ Clear OTP verification flow
- ✅ Toggle between email/phone signup

## Form Validation

### Phone Field Rules:
- Pattern: `+?[0-9\s-()]{10,}` (at least 10 digits with optional + and formatting)
- Accepts: `+923001234567`, `03001234567`, `+92 300 123 4567`
- Required: Yes (red asterisk indicator)
- Note: "We'll use this to confirm your orders"

### OTP Field Rules:
- Exactly 6 digits
- Auto-formats input (only accepts numbers, auto-limits to 6)
- Centered, monospace font for better UX
- Disabled button until all 6 digits entered

## Navigation Between Signup Modes

```
Login Form
  ↓
  "Don't have account?" → Signup (Email) Form
                            ↓
                         Phone field + Toggle button
                            ↓
                         [Sign Up with Phone] button
                            ↓
                         Phone Signup Form
                            ↓
                         [Send Verification Code]
                            ↓
                         Phone Verify Form
                            ↓
                         [Verify & Create Account]
                            ↓
                         ✅ Account Created
                            ↓
                         Redirected to Login
```

## Back Navigation

- **Phone Signup → Email Signup**: "Back to Email Sign Up" button
- **Phone Verify → Phone Signup**: "Back to Email Sign Up" button (accessible via back arrow)
- **Forgot Password → Login**: "Back to login" button (existing)

## Colors & Styling

- Phone field label: Normal (no special styling)
- Required indicator: Red asterisk `<span className="text-destructive">*</span>`
- Helper text: Small, muted foreground color
- Buttons: Gradient (primary to accent) for main actions, outline for secondary
- OTP input: Centered text, monospace font, larger text size for readability

## Mobile Responsive

All forms are fully responsive:
- Single column layout on mobile
- Full-width inputs and buttons
- Touch-friendly input sizes
- Readable font sizes (16px+ for inputs)

## Accessibility

- Proper label associations with `htmlFor`
- Required fields marked with `*`
- Error messages via toast notifications
- Loading states shown with spinner icon
- Clear helper text explaining phone usage

## Form States

### Normal State:
- All inputs visible
- Phone field has helper text
- Sign Up button enabled

### Loading State:
- Spinner icon in button
- All inputs disabled
- Buttons disabled
- Message: "Sending..." or "Verifying..."

### Success State:
- Toast notification
- Redirect to login
- Form fields cleared

### Error State:
- Red toast notification with error message
- Form remains visible for retry
- User can modify inputs and try again
