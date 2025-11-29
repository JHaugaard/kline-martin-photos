/**
 * useGalleryPagination Hook
 *
 * Manages pagination state for the gallery.
 * Supports both traditional pagination and infinite scroll.
 *
 * Features:
 * - Track current page and total items
 * - Calculate items to show
 * - Handle next/previous page navigation
 * - Reset pagination
 */

import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  itemsPerPage?: number
  totalItems?: number
}

interface UsePaginationReturn {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  reset: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

/**
 * Hook to manage pagination
 *
 * Usage:
 * ```
 * const {
 *   currentPage,
 *   itemsPerPage,
 *   startIndex,
 *   endIndex,
 *   nextPage,
 *   previousPage,
 * } = useGalleryPagination({
 *   itemsPerPage: 20,
 *   totalItems: images.length,
 * })
 *
 * const visibleImages = images.slice(startIndex, endIndex)
 * ```
 */
export function useGalleryPagination({
  itemsPerPage = 20,
  totalItems = 0,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }, [totalPages])

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    reset,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  }
}
