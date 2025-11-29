'use client'

/**
 * Pagination Controls Component
 *
 * Displays pagination controls for the gallery.
 * Features:
 * - Previous/Next buttons
 * - Page indicators
 * - Clean, minimal design
 *
 * Design Philosophy:
 * - Subtle and unobtrusive
 * - Only visible when needed (multiple pages)
 * - Quick keyboard shortcuts for power users (future)
 */

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  canGoPrevious: boolean
  canGoNext: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onGoToPage?: (page: number) => void
  isLoading?: boolean
}

export function PaginationControls({
  currentPage,
  totalPages,
  canGoPrevious,
  canGoNext,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  isLoading = false,
}: PaginationControlsProps) {
  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-8 flex items-center justify-between">
      {/* Previous button */}
      <button
        onClick={onPreviousPage}
        disabled={!canGoPrevious || isLoading}
        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {/* Page indicator */}
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>

      {/* Next button */}
      <button
        onClick={onNextPage}
        disabled={!canGoNext || isLoading}
        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  )
}

/**
 * Load More Button Component
 *
 * Alternative to pagination controls for infinite scroll style.
 * Shows a single "Load More" button at the bottom.
 */
interface LoadMoreButtonProps {
  onClick: () => void
  isLoading?: boolean
  hasMore?: boolean
}

export function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore = true,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">No more images to load</p>
      </div>
    )
  }

  return (
    <div className="mt-8 text-center">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="inline-block rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  )
}
