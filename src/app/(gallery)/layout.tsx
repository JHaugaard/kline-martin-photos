/**
 * Gallery Layout
 *
 * Route Group: (gallery)
 * Contains all protected routes that require authentication.
 *
 * Purpose:
 * - Shared layout for authenticated pages
 * - Navigation bar with search, user menu
 * - Consistent padding and structure
 */
export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with navigation - to be added in later steps */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <span className="text-sm font-medium text-gray-900">
            Kline-Martin Photos
          </span>
          {/* SearchBar and UserMenu components will be added later */}
          <div className="text-xs text-gray-400">Menu</div>
        </div>
      </header>

      {/* Main content area */}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
