/**
 * Middleware for handling Supabase session refresh
 *
 * This middleware is used with Next.js to ensure that:
 * 1. Session tokens are refreshed automatically before they expire
 * 2. Cookies are kept in sync between server and browser
 * 3. The user stays logged in across page navigations
 *
 * This is particularly important for magic link authentication,
 * where session duration needs to be properly managed.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session - this will update the token if needed
  await supabase.auth.getSession()

  return supabaseResponse
}
