import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

/**
 * Root Layout
 *
 * This is the top-level layout that wraps all pages in the application.
 * In Next.js App Router, layouts are Server Components by default.
 *
 * Key responsibilities:
 * - Define the HTML structure (<html>, <body>)
 * - Import global styles
 * - Set up metadata (title, description, etc.)
 * - Wrap children with providers (auth, theme, etc.)
 */

export const metadata: Metadata = {
  title: {
    template: '%s | Kline-Martin Photos',
    default: 'Kline-Martin Photos',
  },
  description: 'Private family photo gallery with semantic search',
  keywords: ['family', 'photos', 'gallery', 'private'],
  authors: [{ name: 'Kline-Martin Family' }],
  robots: {
    index: false, // Private gallery - don't index
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
