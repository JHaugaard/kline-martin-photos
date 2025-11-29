'use client'

/**
 * ImageGrid Component
 *
 * Displays a responsive grid of images.
 * Features:
 * - Responsive layout: 2 cols (mobile) → 3 (tablet) → 4 (md) → 5 (lg)
 * - Gap between images that scales responsively
 * - Handles loading and empty states
 * - Client component for future interactivity (lightbox, etc.)
 *
 * Design Philosophy:
 * - Minimal borders and decorations
 * - Subtle spacing that breathes
 * - Focus on the images themselves
 * - Clean, understated aesthetic
 */

import { ImageData } from '@/types'
import { ImageCard } from './ImageCard'

interface ImageGridProps {
  images: ImageData[]
  onImageClick?: (image: ImageData) => void
  isLoading?: boolean
}

export function ImageGrid({
  images,
  onImageClick,
  isLoading = false,
}: ImageGridProps) {
  // Empty state
  if (!isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500">No images found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Responsive grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="aspect-square"
          >
            <ImageCard
              image={image}
              onClick={() => onImageClick?.(image)}
            />
          </div>
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="aspect-square animate-pulse rounded-lg bg-gray-100"
            />
          ))}
      </div>
    </div>
  )
}
