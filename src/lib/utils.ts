import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility Functions
 *
 * cn() - Class name merger
 * Combines clsx (conditional classes) with tailwind-merge (deduplication)
 *
 * Usage:
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
