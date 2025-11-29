/**
 * Next.js Middleware for Authentication
 *
 * This middleware runs on every request and handles:
 * 1. Session token refresh (via updateSession from Supabase SSR)
 * 2. Route protection - redirects unauthenticated users to /login
 * 3. Post-login redirect - sends authenticated users to /gallery
 *
 * How it works:
 * - Request comes in → middleware checks auth status
 * - If protected route and no session → redirect to /login
 * - If on /login and authenticated → redirect to /gallery
 * - Session is refreshed automatically
 *
 * Protected routes are defined in the config.matcher below.
 */

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // updateSession refreshes the Supabase session if needed
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Protected routes - require authentication
    '/gallery/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
    // API routes that need session refresh
    '/api/images/:path*',
    '/api/search/:path*',
    '/api/share/:path*',
  ],
}
