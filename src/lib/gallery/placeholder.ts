/**
 * Placeholder Image Generator
 *
 * For development purposes, generates placeholder images without needing B2.
 * These are used during development until real images are connected.
 *
 * Uses placeholder.com service for realistic-looking development images.
 */

import { ImageData } from '@/types'

/**
 * Sample image data with placeholder images
 * These simulate what will come from the database later
 */
export function generatePlaceholderImages(count: number = 20): ImageData[] {
  const categories = [
    'nature',
    'family',
    'portrait',
    'landscape',
    'beach',
    'mountain',
    'sunset',
    'garden',
    'snow',
    'forest',
    'city',
    'water',
  ]

  const keywords_samples = [
    ['christmas', 'holiday', '2023'],
    ['beach', 'vacation', 'summer'],
    ['hiking', 'mountain', 'adventure'],
    ['family', 'portrait', 'reunion'],
    ['snow', 'winter', 'cold'],
    ['garden', 'flowers', 'spring'],
    ['sunset', 'evening', 'golden'],
    ['forest', 'nature', 'hiking'],
    ['picnic', 'outdoor', 'food'],
    ['birthday', 'celebration', 'party'],
  ]

  const images: ImageData[] = []

  for (let i = 0; i < count; i++) {
    const categoryIndex = i % categories.length
    const keywordIndex = i % keywords_samples.length

    images.push({
      id: `placeholder-${i}`,
      filename: `placeholder-${i}.jpg`,
      storagePath: `/placeholder/${i}`,
      title: `Image ${i + 1}`,
      keywords: keywords_samples[keywordIndex],
      createdAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      // Use Unsplash or similar service for realistic placeholder images
      imageUrl: `https://images.unsplash.com/photo-1${1000000000 + i}?w=500&h=500&fit=crop`,
    })
  }

  return images
}

/**
 * Get a specific number of placeholder images
 *
 * Usage:
 * ```
 * const images = await getPlaceholderImages(20)
 * ```
 */
export async function getPlaceholderImages(
  count: number = 20
): Promise<ImageData[]> {
  // Simulate a small delay like a real database would have
  await new Promise((resolve) => setTimeout(resolve, 100))

  return generatePlaceholderImages(count)
}

/**
 * Placeholder images for different categories
 * Useful for testing specific scenarios
 */
export const PLACEHOLDER_CATEGORIES = {
  nature: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
  ],
  family: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1503454537688-e6c8ff1d9c89?w=500&h=500&fit=crop',
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=500&h=500&fit=crop',
  ],
  sunset: [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=500&fit=crop',
  ],
}
