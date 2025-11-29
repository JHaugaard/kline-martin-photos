'use client'

/**
 * Magic Link Login Form
 *
 * This client component handles the magic link login flow:
 * 1. User enters their email
 * 2. Form is submitted to /api/auth/signin
 * 3. Supabase sends them a magic link email
 * 4. User clicks the link → redirected to /auth/callback
 * 5. Callback exchanges code for session → redirects to /gallery
 *
 * This component is interactive (needs client-side state),
 * so it's marked with 'use client'.
 */

import { useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'

type SignInState = 'idle' | 'loading' | 'success' | 'error'

interface LoginFormProps {
  redirectUrl?: string
}

export function LoginForm(): JSX.Element {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SignInState>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('loading')
    setError(null)

    try {
      // Send magic link to the user's email
      const { error: signInError } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          // After clicking the link, redirect to /auth/callback
          // The callback handler will exchange the code for a session
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        setError(signInError.message)
        setState('error')
      } else {
        setState('success')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
      setState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={state === 'loading' || state === 'success'}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={state === 'loading' || state === 'success' || !email}
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {state === 'loading' && 'Sending link...'}
        {state === 'idle' && 'Send Magic Link'}
        {state === 'success' && 'Check your email'}
        {state === 'error' && 'Try Again'}
      </button>

      {/* Error message */}
      {state === 'error' && error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success message */}
      {state === 'success' && (
        <div className="rounded-md bg-green-50 p-3">
          <p className="text-sm text-green-700">
            Check your email for the magic link. It may take a minute to arrive.
          </p>
        </div>
      )}
    </form>
  )
}
