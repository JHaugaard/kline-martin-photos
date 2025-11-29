/**
 * Auth Layout
 *
 * Route Group: (auth)
 * The parentheses mean this folder doesn't affect the URL.
 * Routes inside are /login and /auth/callback, not /(auth)/login.
 *
 * Purpose:
 * - Shared layout for authentication pages
 * - Centered, minimal design for login flow
 * - No navigation bar (user isn't logged in yet)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
