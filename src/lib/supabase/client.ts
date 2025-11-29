/**
 * Browser-side Supabase client for client components
 *
 * This client is initialized in the browser and has the following characteristics:
 * - Uses the ANON_KEY (public, safe to expose in browser)
 * - Operates under row-level security (RLS) policies
 * - Limited to actions allowed by the current user's RLS policies
 * - Suitable for: Reading user-specific data, updating user profile, uploading images
 * - NOT suitable for: Admin operations, bypassing RLS, directly accessing sensitive tables
 *
 * Usage in Client Components:
 * ```
 * 'use client'
 * import { supabaseClient } from '@/lib/supabase/client'
 *
 * export function MyComponent() {
 *   const fetchData = async () => {
 *     const { data, error } = await supabaseClient
 *       .from('images')
 *       .select('*')
 *       .limit(10)
 *   }
 * }
 * ```
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
