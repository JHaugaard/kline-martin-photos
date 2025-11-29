import { type NextRequest, NextResponse } from 'next/server'

/**
 * Auth Callback Route
 *
 * Route: /auth/callback
 *
 * This is a Route Handler (API route in App Router).
 * Supabase redirects here after the user clicks the magic link.
 *
 * Flow:
 * 1. User clicks magic link in email
 * 2. Supabase redirects to /auth/callback?code=xxx
 * 3. This handler exchanges the code for a session
 * 4. User is redirected to /gallery
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // In Step 2, we'll add Supabase client here to exchange code for session
    // const supabase = createClient()
    // await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to gallery after authentication
  return NextResponse.redirect(new URL('/gallery', request.url))
}
