/**
 * Gallery Page
 *
 * Route: /gallery
 *
 * Main gallery view showing the image grid.
 * This is a Server Component - data fetching happens on the server.
 *
 * Features (to be implemented):
 * - Image grid with responsive layout
 * - Infinite scroll or pagination
 * - Search results display
 */
export default function GalleryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-light text-gray-900">Gallery</h1>

      {/* ImageGrid component will be added in Step 4 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Placeholder cards */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-gray-100 transition-colors hover:bg-gray-200"
          />
        ))}
      </div>
    </div>
  )
}
