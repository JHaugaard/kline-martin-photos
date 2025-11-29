/**
 * useKeyboardNavigation Hook
 *
 * Handles keyboard events for lightbox navigation.
 * Supports arrow keys for navigation and Escape to close.
 */

import { useEffect, useCallback } from 'react'

interface UseKeyboardNavigationProps {
  isActive: boolean
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function useKeyboardNavigation({
  isActive,
  onNext,
  onPrevious,
  onClose,
  canGoNext,
  canGoPrevious,
}: UseKeyboardNavigationProps): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowRight':
          event.preventDefault()
          if (canGoNext) onNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (canGoPrevious) onPrevious()
          break
      }
    },
    [isActive, onClose, onNext, onPrevious, canGoNext, canGoPrevious]
  )

  useEffect(() => {
    if (!isActive) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, handleKeyDown])
}
