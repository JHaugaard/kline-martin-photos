# Supabase Client Setup Guide

## Overview

This document explains the Supabase client configuration for the Kline-Martin Photos gallery. We use **two different clients** to ensure proper security and functionality across the application.

---

## The Two Clients Explained

### 1. Browser Client (`src/lib/supabase/client.ts`)

**What it is**: A Supabase client initialized in the browser with the **ANON_KEY** (anonymous/public key).

**Key Characteristics**:
- ✅ Safe to expose in the browser (it's the public key)
- ✅ Operates under **Row-Level Security (RLS)** policies
- ✅ Limited to what the current logged-in user is allowed to see
- ✅ Automatically includes the user's session in all requests
- ❌ Cannot bypass RLS policies
- ❌ Cannot perform admin-only operations

**Use Cases**:
- Reading public or user-specific image data
- Updating the current user's profile
- Uploading images to user's gallery
- Performing searches (both keyword and semantic)
- Creating share links for your own images
- Any operation from a **Client Component**

**Code Example**:
```typescript
'use client'
import { supabaseClient } from '@/lib/supabase/client'

export function ImageGallery() {
  const fetchImages = async () => {
    const { data, error } = await supabaseClient
      .from('images')
      .select('*')
      .limit(10)

    if (error) console.error('Failed to fetch:', error)
    return data
  }

  return <div>{/* ... */}</div>
}
```

**When to Use in Components**:
- Inside components marked with `'use client'`
- When you need to fetch data that depends on user session
- When building interactive features (search, filters, etc.)

---

### 2. Server Client (`src/lib/supabase/server.ts`)

**What it is**: A Supabase client that runs only on the server using the **SERVICE_ROLE_KEY** (secret, admin key).

**Key Characteristics**:
- 🔐 Secret key - must NEVER be exposed to the browser
- ✅ Has elevated permissions - can bypass RLS policies
- ✅ Suitable for administrative operations
- ✅ Runs only on the server (safe)
- ❌ Cannot access browser/client context
- ❌ Should not be used for user-specific operations (use browser client instead)

**Use Cases**:
- Reading all images (admin view)
- System-level operations (migrations, bulk updates)
- Operations that must bypass RLS
- Administrative tasks (managing users, keywords)
- Running in **Server Components** or **API Routes**

**Code Example in Server Component**:
```typescript
// ✅ NO 'use client' directive - this is a server component
import { supabaseServer } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  // This runs on the server, so the service key is hidden
  const { data: allImages } = await supabaseServer
    .from('images')
    .select('*')

  return <div>{allImages?.length} images in system</div>
}
```

**Code Example in API Route**:
```typescript
// src/app/api/admin/images/route.ts
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Server-side operation - service key is safe
  const { data } = await supabaseServer
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })

  return Response.json(data)
}
```

---

## Decision Tree: Which Client to Use

```
┌─ Where is this code running?
│
├─ In a Client Component (has 'use client' at top)?
│  └─ Use: supabaseClient (browser client)
│
├─ In a Server Component (no 'use client')?
│  └─ Use: supabaseServer (server client)
│
└─ In an API Route (src/app/api/*/route.ts)?
   └─ Use: supabaseServer (server client)
```

**Example Decision**:

| Scenario | Location | Client | Why |
|----------|----------|--------|-----|
| User searches images | Client Component | `supabaseClient` | Needs user session, interactive |
| Load gallery on page visit | Server Component | `supabaseServer` | Initial page load, can fetch all data |
| API endpoint for keywords | API Route | `supabaseServer` | Runs on server, can be admin-only |
| User updates profile | Client Component | `supabaseClient` | User-specific, interactive |
| Admin stats dashboard | Server Component | `supabaseServer` | Admin operation, can bypass RLS |

---

## Row-Level Security (RLS) Overview

**What is RLS?**

Row-Level Security is a PostgreSQL feature that restricts what data users can access based on policies you define.

**How it Works with Our Two Clients**:

1. **Browser Client** (`supabaseClient`):
   - Always operates **with** RLS policies active
   - A regular user can only access images they own or are public
   - Admin users might have different permissions based on RLS policy

2. **Server Client** (`supabaseServer`):
   - By default, bypasses RLS policies (has admin power)
   - Can access all data regardless of user permissions
   - Should be used carefully for system operations

**Example RLS Policy** (in Supabase):
```sql
-- Allow users to see all images (viewer access)
CREATE POLICY "users_can_view_images" ON images
  FOR SELECT
  USING (true);  -- Everyone can view

-- Allow only admins to update keywords
CREATE POLICY "admins_can_update_keywords" ON images
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## Session Management with Middleware

**Problem**: Browser sessions expire, and we need to refresh them automatically.

**Solution**: The middleware file (`src/lib/supabase/middleware.ts`) handles this.

**How it Works**:
1. Runs on every page request
2. Checks if the session token needs refreshing
3. Automatically updates the token if expired
4. Keeps cookies in sync between server and browser

**Integration** (you'll add this to `middleware.ts` in your project):
```typescript
// src/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Protected routes
    '/gallery/:path*',
    '/admin/:path*',
    // API routes
    '/api/:path*',
  ],
}
```

---

## Type Safety with Database Types

**What are `Database` types?**

The `src/types/database.ts` file defines the structure of your database tables in TypeScript. This gives you:

1. **Autocomplete in your IDE**: As you type `supabaseClient.from('images').select(`, your IDE knows what columns exist
2. **Compile-time checking**: TypeScript catches typos like `selectt()` before you run the code
3. **Type-safe data**: When you fetch data, TypeScript knows it's an `Image` object

**Usage Example**:
```typescript
import { supabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Image = Database['public']['Tables']['images']['Row']

async function getImage(id: string): Promise<Image | null> {
  const { data } = await supabaseClient
    .from('images')
    .select('*')
    .eq('id', id)
    .single()

  return data
}
```

**Updating Types in Production**:

In a real project, you'd auto-generate these types from your live Supabase schema:

```bash
supabase gen types typescript \
  --project-id=YOUR_PROJECT_ID \
  --schema=public > src/types/database.ts
```

For now, they're manually written based on the CLAUDE.md schema.

---

## Common Patterns

### Pattern 1: Fetch Data in a Server Component

```typescript
// ✅ No 'use client' - this is a server component
import { supabaseServer } from '@/lib/supabase/server'

export default async function Gallery() {
  const { data: images } = await supabaseServer
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="grid">
      {images?.map(img => (
        <ImageCard key={img.id} image={img} />
      ))}
    </div>
  )
}
```

### Pattern 2: Search in a Client Component

```typescript
'use client'
import { useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'

export function SearchBar() {
  const [results, setResults] = useState([])

  const handleSearch = async (query: string) => {
    const { data } = await supabaseClient
      .from('images')
      .select('*')
      .ilike('keywords', `%${query}%`)

    setResults(data ?? [])
  }

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      {results.map(img => <ImageCard key={img.id} image={img} />)}
    </div>
  )
}
```

### Pattern 3: API Route for Admin Operations

```typescript
// src/app/api/admin/keywords/route.ts
import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This endpoint should be protected (add auth checks in production)
export async function POST(request: NextRequest) {
  const { imageId, keywords } = await request.json()

  const { data, error } = await supabaseServer
    .from('images')
    .update({ keywords })
    .eq('id', imageId)
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(data)
}
```

---

## Environment Variables

These must be set in your `.env.local` file:

```bash
# Public - safe for browser
NEXT_PUBLIC_SUPABASE_URL=https://supabase.haugaard.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Secret - server-side only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: The names matter:
- `NEXT_PUBLIC_*` variables are embedded in the browser bundle
- Non-`NEXT_PUBLIC_*` variables stay on the server
- Never prefix the service role key with `NEXT_PUBLIC_`

---

## Troubleshooting

### "Cannot find module '@supabase/ssr'"
- The browser client uses `@supabase/ssr` package
- Ensure it's installed: `pnpm install @supabase/ssr`

### "RLS policy violation" error
- You're using `supabaseClient` and hitting an RLS policy
- Either: adjust the RLS policy, or use `supabaseServer` if it's an admin operation

### "Service role key is undefined"
- `SUPABASE_SERVICE_ROLE_KEY` is not set in `.env.local`
- Add it from your Supabase project settings

### Session keeps expiring
- Check that middleware is configured correctly
- Verify cookies are being set (check browser DevTools)

---

## Next Steps

1. **Add `.env.local`** with your Supabase credentials
2. **Create middleware.ts** in your project root to use the session update function
3. **Build a Server Component** that fetches images using `supabaseServer`
4. **Build a Client Component** that searches using `supabaseClient`
5. **Test the RLS policies** to ensure permissions work correctly

Once this is working, you'll move on to Step 3: Implementing Magic Link Authentication.
