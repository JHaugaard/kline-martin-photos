/**
 * Server-side Supabase client for Server Components and API Routes
 *
 * This client uses the SERVICE_ROLE_KEY and has the following characteristics:
 * - Has elevated permissions (bypasses RLS by default)
 * - Only runs on the server, never exposed to the browser
 * - Suitable for: Admin operations, system-level queries, bypassing RLS when needed
 * - NOT suitable for: User-specific operations (use browser client instead)
 *
 * Usage in Server Components:
 * ```
 * import { supabaseServer } from '@/lib/supabase/server'
 *
 * export default async function MyServerComponent() {
 *   const { data: images } = await supabaseServer
 *     .from('images')
 *     .select('*')
 *     .limit(10)
 *
 *   return <div>{images?.length} images</div>
 * }
 * ```
 *
 * Usage in API Routes:
 * ```
 * import { supabaseServer } from '@/lib/supabase/server'
 *
 * export async function GET(request: Request) {
 *   const { data } = await supabaseServer
 *     .from('images')
 *     .select('*')
 *
 *   return Response.json(data)
 * }
 * ```
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)
