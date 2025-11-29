import Link from 'next/link'

/**
 * Landing Page
 *
 * This is the root page of the application (/).
 * For unauthenticated users, it shows a welcome message.
 * Authenticated users will be redirected to /gallery.
 *
 * Server Component by default - no 'use client' needed.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-3xl font-light tracking-tight text-gray-900">
          Kline-Martin Photos
        </h1>
        <p className="mb-8 text-gray-600">
          A private gallery for our family memories.
        </p>
        <Link
          className="inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          href="/login"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
