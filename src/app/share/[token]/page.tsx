/**
 * Share Page
 *
 * Route: /share/[token]
 *
 * Dynamic route for public share links.
 * The [token] is a URL parameter extracted from the path.
 *
 * This page is PUBLIC - no authentication required.
 * Shows a single image without any metadata or gallery access.
 */

interface SharePageProps {
  params: Promise<{
    token: string
  }>
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl">
        {/* Image will be loaded based on token in Step 10 */}
        <div className="aspect-video rounded-lg bg-gray-200">
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Shared image (token: {token})
          </div>
        </div>
      </div>
    </div>
  )
}
