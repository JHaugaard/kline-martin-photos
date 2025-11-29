import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

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
 * 4. Session cookie is set in the browser
 * 5. User is redirected to /gallery
 *
 * The code is a one-time-use token that proves the user has access to the email.
 * Exchanging it creates a Supabase session (stored in cookies).
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // If we have a code from the magic link, exchange it for a session
  if (code) {
    // Create a server client to handle the token exchange
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // The response cookies will be sent back to set the session
            })
          },
        },
      }
    )

    // Exchange the code for a session
    // This creates a JWT token that proves the user is authenticated
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Success! Redirect to gallery
      return NextResponse.redirect(new URL('/gallery', request.url))
    }

    // If there's an error, we'll redirect to login with an error message
    return NextResponse.redirect(
      new URL('/login?error=Authentication failed', request.url)
    )
  }

  // If no code, something went wrong - redirect to login
  return NextResponse.redirect(new URL('/login?error=Invalid callback', request.url))
}
