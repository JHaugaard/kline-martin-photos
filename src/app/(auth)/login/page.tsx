/**
 * Login Page
 *
 * Route: /login
 *
 * Displays the magic link login form.
 * User enters email, receives a link, clicks to authenticate.
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

      {/* LoginForm component will be added in Step 3 */}
      <div className="text-center text-sm text-gray-400">
        Login form coming soon...
      </div>
    </div>
  )
}
