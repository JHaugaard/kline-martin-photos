'use client'

/**
 * ImageCard Component
 *
 * Displays a single image in the gallery grid.
 * Features:
 * - Responsive square aspect ratio
 * - Hover state with subtle overlay
 * - Click handler for lightbox (future)
 * - Clean, minimal design
 *
 * This is a client component because it handles hover state and click events.
 */

import Image from 'next/image'
import type { ImageData } from '@/types'

interface ImageCardProps {
  image: ImageData
  onClick?: () => void
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative h-full w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
    >
      {/* Image - will be a real image from B2 in the future */}
      <div className="relative h-full w-full">
        {image.imageUrl ? (
          <Image
            src={image.imageUrl}
            alt={image.title || image.filename}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={false}
          />
        ) : (
          // Placeholder for development
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Hover overlay - subtle and minimal */}
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-5" />

      {/* Title overlay on hover - optional, minimal */}
      {image.title && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="w-full truncate px-3 py-2 text-sm text-white">
            {image.title}
          </p>
        </div>
      )}
    </button>
  )
}
