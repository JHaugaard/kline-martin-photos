'use client'

/**
 * Gallery Page
 *
 * Route: /gallery
 *
 * Main gallery view showing the image grid.
 *
 * Features:
 * - Responsive image grid (2/3/4/5 columns depending on screen size)
 * - Pagination controls for navigating through images
 * - Placeholder images during development (will connect to B2 later)
 * - Clean, understated design focused on the images
 *
 * This is a client component to support interactivity like pagination and future lightbox.
 * In production, we'd use Server Components for initial page load performance,
 * but this is simpler for development.
 */

import { useState, useEffect } from 'react'
import { ImageGrid } from '@/components/gallery/ImageGrid'
import { PaginationControls } from '@/components/gallery/PaginationControls'
import { useGalleryPagination } from '@/hooks/useGalleryPagination'
import { getPlaceholderImages } from '@/lib/gallery/placeholder'
import { ImageData } from '@/types'

const ITEMS_PER_PAGE = 20

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const pagination = useGalleryPagination({
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: images.length,
  })

  // Load placeholder images on mount
  useEffect(() => {
    async function loadImages() {
      setIsLoading(true)
      try {
        // For development: load placeholder images
        const placeholderImages = await getPlaceholderImages(100)
        setImages(placeholderImages)

        // In production, this would be:
        // const { data: realImages } = await supabaseServer
        //   .from('images')
        //   .select('*')
        //   .order('created_at', { ascending: false })
      } catch (error) {
        console.error('Failed to load images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Get current page of images
  const visibleImages = images.slice(pagination.startIndex, pagination.endIndex)

  return (
    <div>
      {/* Page title */}
      <h1 className="mb-6 text-2xl font-light text-gray-900">Gallery</h1>

      {/* Image grid */}
      <ImageGrid
        images={visibleImages}
        onImageClick={(image) => {
          // Future: Open lightbox
          console.log('Clicked:', image.filename)
        }}
        isLoading={isLoading}
      />

      {/* Pagination controls */}
      {!isLoading && images.length > ITEMS_PER_PAGE && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPreviousPage={pagination.previousPage}
          onNextPage={pagination.nextPage}
        />
      )}

      {/* Loading state message */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-gray-500">Loading gallery...</div>
        </div>
      )}
    </div>
  )
}
