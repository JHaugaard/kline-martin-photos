'use client'

/**
 * Lightbox Component
 *
 * Full-screen image viewer with navigation.
 * Features:
 * - Keyboard navigation (arrow keys, escape)
 * - Swipe support for mobile
 * - Clean, minimal dark overlay
 * - Smooth transitions
 *
 * Design Philosophy:
 * - Focus on the image, minimal UI chrome
 * - Navigation controls visible but unobtrusive
 * - Accessible with keyboard and touch
 */

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { ImageData } from '@/types'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

interface LightboxProps {
  image: ImageData | null
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  currentIndex: number
  totalImages: number
}

export function Lightbox({
  image,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  currentIndex,
  totalImages,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useKeyboardNavigation({
    isActive: isOpen,
    onNext,
    onPrevious,
    onClose,
    canGoNext,
    canGoPrevious,
  })

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      touchStartX.current = touch.clientX
      touchEndX.current = null
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      touchEndX.current = touch.clientX
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const startX = touchStartX.current
    const endX = touchEndX.current

    if (startX === null || endX === null) return

    const deltaX = endX - startX
    const minSwipeDistance = 50

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && canGoPrevious) {
        onPrevious()
      } else if (deltaX < 0 && canGoNext) {
        onNext()
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }, [canGoNext, canGoPrevious, onNext, onPrevious])

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen || !image) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close lightbox"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous button */}
      {canGoPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous image"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next image"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {image.imageUrl ? (
          <Image
            src={image.imageUrl}
            alt={image.title || image.filename}
            width={1200}
            height={800}
            className="max-h-[90vh] w-auto object-contain"
            priority
            sizes="90vw"
          />
        ) : (
          <div className="flex h-[60vh] w-[80vw] items-center justify-center rounded-lg bg-gray-800">
            <svg
              className="h-16 w-16 text-gray-600"
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

      {/* Image info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-4">
        <div className="flex items-center justify-between text-white/80">
          <div>
            {image.title && (
              <h2 className="text-lg font-light">{image.title}</h2>
            )}
            <p className="text-sm text-white/60">{image.filename}</p>
          </div>
          <div className="text-sm">
            {currentIndex + 1} / {totalImages}
          </div>
        </div>
      </div>
    </div>
  )
}
