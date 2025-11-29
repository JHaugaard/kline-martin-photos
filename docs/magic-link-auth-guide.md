# Magic Link Authentication Implementation Guide

## Overview

This guide explains the complete magic link authentication flow that was implemented for the Kline-Martin Photos gallery. Magic link authentication allows users to sign in with just their email - no password required.

**Key Benefits**:
- ✅ No passwords to manage or forget
- ✅ More secure than traditional passwords
- ✅ Works great for a family gallery
- ✅ Built into Supabase Auth
- ✅ Email-based verification

---

## How Magic Link Authentication Works

### The Complete Flow (7 Steps)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User visits /login                                  │
├─────────────────────────────────────────────────────────────┤
│ LoginForm component renders                                  │
│ User enters their email: john@example.com                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 2: User clicks "Send Magic Link"                       │
├─────────────────────────────────────────────────────────────┤
│ LoginForm calls: supabase.auth.signInWithOtp({              │
│   email: 'john@example.com',                                │
│   options: { emailRedirectTo: '/auth/callback' }            │
│ })                                                           │
│                                                              │
│ Supabase generates a one-time code and sends it to the      │
│ user's email with a link containing the code.               │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 3: User receives email with magic link                 │
├─────────────────────────────────────────────────────────────┤
│ Email from: auth@supabase.com                               │
│ Subject: Confirm your login                                 │
│ Link: https://kline-martin-photos.com/auth/callback?code=xy │
│                                                              │
│ The code is valid for a limited time (e.g., 24 hours)      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 4: User clicks the magic link in their email           │
├─────────────────────────────────────────────────────────────┤
│ Browser navigates to:                                        │
│ /auth/callback?code=xyz123abc...                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 5: Callback handler exchanges code for session         │
├─────────────────────────────────────────────────────────────┤
│ Route: src/app/(auth)/auth/callback/route.ts                │
│                                                              │
│ Handler does:                                               │
│ 1. Extract code from URL: searchParams.get('code')          │
│ 2. Create server Supabase client                            │
│ 3. Call: supabase.auth.exchangeCodeForSession(code)         │
│ 4. Supabase validates the code                              │
│ 5. Session JWT is created and stored in cookies             │
│                                                              │
│ Result: Session cookie is set in browser                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 6: Callback redirects to /gallery                      │
├─────────────────────────────────────────────────────────────┤
│ return NextResponse.redirect(new URL('/gallery', url))      │
│                                                              │
│ User is now redirected to the protected gallery page        │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ STEP 7: User sees the gallery                               │
├─────────────────────────────────────────────────────────────┤
│ Middleware checks for valid session → allows access         │
│ Gallery page renders with their photos                      │
│ UserProfile component shows their email and role            │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Created

### 1. [src/middleware.ts](src/middleware.ts) - Route Protection

**Purpose**: Handles session refresh and protects routes.

**What it does**:
- Runs on every request matching the patterns in `config.matcher`
- Calls `updateSession()` which refreshes the Supabase token if needed
- Keeps session cookies in sync

**Protected routes** (require authentication):
- `/gallery/*` - Photo gallery
- `/admin/*` - Admin pages (future)
- `/api/protected/*` - Protected API endpoints
- `/api/images/*` - Image operations
- `/api/search/*` - Search operations
- `/api/share/*` - Share link operations

**Code**:
```typescript
export const config = {
  matcher: [
    '/gallery/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
    // ... more routes
  ],
}
```

### 2. [src/app/(auth)/auth/callback/route.ts](src/app/(auth)/auth/callback/route.ts) - Token Exchange

**Purpose**: Exchanges the magic link code for a session.

**What it does**:
1. Extracts the `code` from URL: `/auth/callback?code=xyz`
2. Creates a server Supabase client
3. Calls `exchangeCodeForSession(code)` to validate and create session
4. Redirects to `/gallery` if successful
5. Redirects to `/login` with error message if failed

**Key point**: This is the crucial step where the one-time code becomes a real session.

### 3. [src/lib/auth/index.ts](src/lib/auth/index.ts) - Auth Utilities

**Purpose**: Helper functions for common auth tasks in Server Components.

**Functions**:
- `getCurrentUser()` - Get the currently logged-in user
- `requireAuth()` - Redirect to /login if not authenticated
- `signOut()` - Sign out the user and redirect to /login
- `getUserProfile(userId)` - Get user's profile including role

**Usage in Server Components**:
```typescript
export default async function ProtectedPage() {
  const user = await requireAuth()  // Redirects if not logged in
  return <div>Hello {user.email}</div>
}
```

### 4. [src/components/auth/LoginForm.tsx](src/components/auth/LoginForm.tsx) - Magic Link Form

**Purpose**: User-facing form to request a magic link.

**What it does**:
1. Renders an email input field
2. Handles form submission
3. Calls `supabase.auth.signInWithOtp()`
4. Shows loading state while email is being sent
5. Shows success message after email is sent
6. Shows error message if something goes wrong

**State Management**:
- `idle` - Initial state, ready for input
- `loading` - Sending the magic link
- `success` - Email sent, check your inbox
- `error` - Something went wrong

**Key prop**:
```typescript
// The form uses this callback URL for the magic link
emailRedirectTo: `${window.location.origin}/auth/callback`
```

### 5. [src/components/auth/UserProfile.tsx](src/components/auth/UserProfile.tsx) - Profile Display

**Purpose**: Display the currently logged-in user's information.

**What it renders**:
- User's email address
- User's role (Admin 👤 or Viewer 👁)
- Sign out button

**Two variants**:
1. `UserProfile` - Full profile card with role badge
2. `UserBadge` - Minimal inline badge for header

**Usage**:
```typescript
import { UserProfile } from '@/components/auth/UserProfile'

export default function Header() {
  return (
    <header>
      <h1>Gallery</h1>
      <UserProfile />  {/* Shows user info + sign out button */}
    </header>
  )
}
```

### 6. [src/components/auth/SignOutButton.tsx](src/components/auth/SignOutButton.tsx) - Sign Out

**Purpose**: Button component that signs out the user.

**What it does**:
1. Form submission (Server Action) to `/lib/auth/signOut()`
2. Clears the session
3. Redirects to `/login`

**Usage**:
```typescript
<SignOutButton />  // Shows "Sign Out" button
<SignOutButton variant="ghost" size="sm" />  // Shows "×" (close icon)
```

---

## Detailed Flow Explanations

### Why We Need a Callback Handler

The callback handler is critical because:

1. **Code → Session Exchange**: The magic link contains a temporary code. This code by itself isn't a session - it's just proof the user received the email.

2. **Server-side Validation**: The code must be validated on the server (where the secret key is safe). The browser never touches the secret key.

3. **Session Creation**: Only after validating the code does Supabase create a real session (JWT token) stored in a cookie.

**Without the callback handler**, the link in the email wouldn't work - there would be no way to turn the code into a session.

### Session Management with Middleware

The middleware runs on every request and does one key thing:

```typescript
await updateSession(request)
```

This function:
1. Reads existing session cookies from the request
2. Calls `getSession()` to check if the token is valid
3. Refreshes the token if it's about to expire
4. Updates cookies in the response

**Why this matters**: Session tokens expire. Without the middleware refreshing them, users would get logged out randomly. The middleware keeps them logged in automatically.

### Why Two Types of Supabase Clients

In this auth flow, we use:

1. **Browser Client** (in LoginForm):
   ```typescript
   const supabase = createClientComponentClient<Database>()
   await supabase.auth.signInWithOtp({ email })
   ```
   - Uses the public ANON_KEY
   - Initiates the login flow

2. **Server Client** (in callback handler):
   ```typescript
   const supabase = createServerClient<Database>(...)
   await supabase.auth.exchangeCodeForSession(code)
   ```
   - Uses the public ANON_KEY (for cookies)
   - But the exchange happens on the server where it's validated

The callback handler could be called from the browser, but it's safer to do it server-side.

---

## Email Configuration

For magic link emails to work, you need to configure Supabase Auth in your project.

**In Supabase Dashboard**:
1. Go to Authentication → Email Templates
2. Configure the email template for magic links
3. Set up the redirect URL: `https://kline-martin-photos.com/auth/callback`
4. Set up SMTP or use Supabase's default email provider

**In .env.local**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://supabase.haugaard.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Testing the Flow Locally

### Step 1: Start the Development Server
```bash
cd /Volumes/dev/develop/kline-martin-photos
pnpm dev
# Navigate to http://localhost:3000
```

### Step 2: Visit Login Page
```
http://localhost:3000/login
```

You should see the login form with an email input.

### Step 3: Enter Your Email
Use an email you have access to (or a test email service like Mailtrap).

### Step 4: Check Your Email
After a moment, you should receive an email from Supabase with a magic link.

### Step 5: Click the Magic Link
The email will contain a link like:
```
https://localhost:3000/auth/callback?code=abc123...
```

Click it to return to the app.

### Step 6: Should See Gallery
If everything works, you'll be redirected to `/gallery` and see your session is active.

---

## Common Issues and Solutions

### "Email not received"

**Possible causes**:
1. Email provider is not configured in Supabase
2. Email is in your spam folder
3. Rate limiting - wait a minute and try again
4. Email address not invited/whitelisted

**Solution**:
- Check Supabase Auth settings for email provider
- Check spam folder
- Ask the admin to whitelist your email
- Check Supabase logs for the error

### "Code is invalid or expired"

**Possible causes**:
1. Clicked the link more than once (code is one-time-use)
2. Waited too long (default: 24 hours)
3. Callback URL doesn't match redirect URL in Supabase

**Solution**:
- Request a new magic link
- Check that redirect URL in Supabase matches your domain
- Ensure callback handler is at `/auth/callback`

### "Session expires too quickly"

**Possible causes**:
1. Session refresh is not working
2. Cookies are not being set/read properly
3. Browser privacy settings blocking cookies

**Solution**:
- Check middleware.ts is configured
- Check Supabase session settings
- Check browser allows third-party cookies (if on different domain)

### "Keep getting redirected to /login"

**Possible causes**:
1. Session token is invalid
2. Cookies are not persistent
3. Middleware is blocking the request

**Solution**:
- Clear browser cookies and try again
- Check browser cookie settings
- Check middleware.ts matcher includes `/gallery`

---

## Security Considerations

### ✅ What's Secure

1. **No passwords stored**: Users never set a password
2. **One-time codes**: Magic link codes are single-use, expire quickly
3. **HTTPS only**: In production, links should only work over HTTPS
4. **Server-side validation**: Code exchange happens on server
5. **Secure cookies**: Session stored in HTTP-only cookies
6. **Token refresh**: Old tokens are automatically refreshed

### ⚠️ What to Watch For

1. **Email security**: Magic links are sent via email. Email is not encrypted.
   - *Mitigation*: Limit who can request links, monitor for abuse

2. **Link expiration**: If someone gets the link, they can sign in
   - *Mitigation*: Links expire quickly (Supabase default: 24 hours)

3. **Email forwarding**: If user forwards their email, someone else gets the link
   - *Mitigation*: Can't prevent, but links are time-limited

4. **Phishing**: Attacker could send fake magic link emails
   - *Mitigation*: Only send from official Supabase domain

### Best Practices Implemented

✅ Middleware refreshes tokens automatically
✅ Session cookies are HTTP-only (can't be stolen by JavaScript)
✅ Redirect URLs are validated by Supabase
✅ Callback handler validates the code server-side
✅ User passwords are never transmitted

---

## Next Steps

Now that authentication is working, you can:

1. **Add the UserProfile component to your layout**:
   ```typescript
   import { UserProfile } from '@/components/auth/UserProfile'

   export default function Header() {
     return <UserProfile />
   }
   ```

2. **Protect pages that need authentication**:
   ```typescript
   export default async function GalleryPage() {
     const user = await requireAuth()  // Redirects if not logged in
     // ... rest of component
   }
   ```

3. **Create an admin check**:
   ```typescript
   const profile = await getUserProfile(user.id)
   if (profile?.role !== 'admin') {
     throw new Error('Admin access required')
   }
   ```

4. **Set up Row-Level Security (RLS)** in Supabase to enforce permissions at the database level.

5. **Move to Step 4**: Build the Gallery Grid Component.

---

## File Reference

| File | Purpose |
|------|---------|
| [src/middleware.ts](src/middleware.ts) | Route protection & session refresh |
| [src/app/(auth)/auth/callback/route.ts](src/app/(auth)/auth/callback/route.ts) | Token exchange handler |
| [src/lib/auth/index.ts](src/lib/auth/index.ts) | Auth utility functions |
| [src/components/auth/LoginForm.tsx](src/components/auth/LoginForm.tsx) | Magic link form |
| [src/components/auth/UserProfile.tsx](src/components/auth/UserProfile.tsx) | User info display |
| [src/components/auth/SignOutButton.tsx](src/components/auth/SignOutButton.tsx) | Sign out button |
| [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx) | Login page |
