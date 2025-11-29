'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Input Component
 *
 * Base text input with consistent styling.
 * Handles focus states and error display.
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-gray-200 focus:border-gray-400',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
