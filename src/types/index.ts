/**
 * Type Definitions
 *
 * Central location for shared TypeScript types.
 * Database types will be auto-generated from Supabase in Step 2.
 */

/**
 * Image data returned from the database
 */
export interface ImageData {
  id: string
  filename: string
  storagePath: string
  title: string | null
  keywords: string[]
  createdAt: string
  updatedAt: string
  // Optional: image URL for display (from B2 or placeholder)
  imageUrl?: string
}

/**
 * Search result with similarity score
 */
export interface SearchResult extends ImageData {
  similarity: number
}

/**
 * Share link data
 */
export interface ShareLink {
  id: string
  imageId: string
  token: string
  createdAt: string
  createdBy: string
}

/**
 * User profile with role
 */
export interface UserProfile {
  id: string
  email: string
  role: 'viewer' | 'admin'
  createdAt: string
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
