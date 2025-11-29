/**
 * useLightbox Hook
 *
 * Manages lightbox state for image viewing.
 * Handles opening, closing, and navigation between images.
 */

import { useState, useCallback } from 'react'
import type { ImageData } from '@/types'

interface UseLightboxReturn {
  isOpen: boolean
  currentImage: ImageData | null
  currentIndex: number
  open: (image: ImageData, index: number) => void
  close: () => void
  next: () => void
  previous: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function useLightbox(images: ImageData[]): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentImage = isOpen ? images[currentIndex] ?? null : null
  const canGoNext = currentIndex < images.length - 1
  const canGoPrevious = currentIndex > 0

  const open = useCallback((_image: ImageData, index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const next = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [canGoNext])

  const previous = useCallback(() => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [canGoPrevious])

  return {
    isOpen,
    currentImage,
    currentIndex,
    open,
    close,
    next,
    previous,
    canGoNext,
    canGoPrevious,
  }
}
