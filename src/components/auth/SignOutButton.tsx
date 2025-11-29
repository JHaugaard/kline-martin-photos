'use client'

/**
 * Sign Out Button Component
 *
 * A simple button that signs out the current user.
 * This is a Client Component because it needs to handle clicks and form submission.
 */

import { signOut } from '@/lib/auth'

interface SignOutButtonProps {
  variant?: 'default' | 'ghost'
  size?: 'md' | 'sm'
}

export function SignOutButton({ variant = 'default', size = 'md' }: SignOutButtonProps) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={
          variant === 'ghost'
            ? 'text-sm text-gray-600 hover:text-gray-900 transition-colors'
            : 'inline-block rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 transition-colors'
        }
      >
        {size === 'sm' ? '×' : 'Sign Out'}
      </button>
    </form>
  )
}
