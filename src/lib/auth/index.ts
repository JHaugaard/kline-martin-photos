/**
 * Authentication utilities for the Kline-Martin Photos gallery
 *
 * These functions help with common auth tasks like:
 * - Getting the current user from a Server Component
 * - Checking if a user is authenticated
 * - Signing out
 * - Redirecting based on auth status
 */

import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Get the current user from a Server Component
 *
 * This function:
 * 1. Creates a server Supabase client
 * 2. Gets the current session
 * 3. Returns the user object if authenticated
 * 4. Returns null if not authenticated
 *
 * Usage:
 * ```
 * export default async function ProtectedPage() {
 *   const user = await getCurrentUser()
 *   if (!user) redirect('/login')
 *   return <div>Hello {user.email}</div>
 * }
 * ```
 */
export async function getCurrentUser() {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // In a Server Component, we need to import cookies from next/headers
          const { cookies } = require('next/headers')
          return cookies().getAll()
        },
        setAll(cookiesToSet: any) {
          // In a Server Component, we can't set cookies directly
          // The middleware handles this
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Require authentication for a page
 *
 * If the user is not authenticated, redirect them to /login.
 * If authenticated, return the user object.
 *
 * Usage:
 * ```
 * export default async function ProtectedPage() {
 *   const user = await requireAuth()
 *   return <div>Hello {user.email}</div>
 * }
 * ```
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

/**
 * Sign out the current user
 *
 * This function:
 * 1. Gets the server Supabase client
 * 2. Calls signOut() to clear the session
 * 3. Redirects to /login
 *
 * Usage (in a Server Action):
 * ```
 * 'use server'
 * import { signOut } from '@/lib/auth'
 *
 * export async function handleSignOut() {
 *   await signOut()
 * }
 * ```
 */
export async function signOut() {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const { cookies } = require('next/headers')
          return cookies().getAll()
        },
        setAll(cookiesToSet: any) {
          // Handled by middleware
        },
      },
    }
  )

  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get user profile from the profiles table
 *
 * This fetches the user's profile including their role (viewer or admin).
 *
 * Usage:
 * ```
 * const user = await getCurrentUser()
 * if (user) {
 *   const profile = await getUserProfile(user.id)
 *   console.log(profile.role) // 'viewer' or 'admin'
 * }
 * ```
 */
export async function getUserProfile(userId: string) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const { cookies } = require('next/headers')
          return cookies().getAll()
        },
        setAll(cookiesToSet: any) {
          // Handled by middleware
        },
      },
    }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return profile
}
