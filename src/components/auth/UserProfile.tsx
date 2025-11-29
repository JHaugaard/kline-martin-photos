/**
 * User Profile Display Component
 *
 * This Server Component displays information about the currently logged-in user.
 * It's designed to be placed in a header or sidebar to show:
 * - User's email
 * - User's role (viewer/admin)
 * - Sign out button
 *
 * Because it fetches data from the database, it's a Server Component (no 'use client').
 */

import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { SignOutButton } from './SignOutButton'

export async function UserProfile() {
  // Get the current authenticated user from Supabase
  const user = await getCurrentUser()

  // If not authenticated, don't render anything
  if (!user) {
    return null
  }

  // Get the user's profile to see their role
  const profile = await getUserProfile(user.id)

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{user.email}</p>
        <p className="text-xs text-gray-600">
          {profile?.role === 'admin' ? '👤 Admin' : '👁 Viewer'}
        </p>
      </div>
      <SignOutButton />
    </div>
  )
}

/**
 * Alternative: Simple inline user display
 *
 * Use this for a minimal header badge showing just the email
 */
export async function UserBadge() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1">
      <span className="text-sm text-white">{user.email}</span>
      <SignOutButton variant="ghost" size="sm" />
    </div>
  )
}
