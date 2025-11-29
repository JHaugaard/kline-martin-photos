import { LoginForm } from '@/components/auth/LoginForm'

/**
 * Login Page
 *
 * Route: /login
 *
 * Displays the magic link login form.
 * User enters email, receives a link, clicks to authenticate.
 *
 * Flow:
 * 1. User visits /login
 * 2. LoginForm component renders
 * 3. User enters email and clicks "Send Magic Link"
 * 4. Magic link email is sent
 * 5. User clicks link in email
 * 6. Redirected to /auth/callback?code=xxx
 * 7. Callback exchanges code for session
 * 8. Redirected to /gallery
 */
export default function LoginPage() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-xl font-medium text-gray-900">
        Sign In
      </h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Enter your email to receive a magic link.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-xs text-gray-500">
        Only invited family members can sign in.
      </p>
    </div>
  )
}
