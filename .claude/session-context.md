# Session Context: Kline-Martin Photos

## Current Status

**Phase:** Guided Setup - Steps 2, 3, 4 COMPLETE
**Mode:** BALANCED
**Next:** Step 5 (Add Lightbox Viewer)

## What We've Done This Session

### Step 2: Configure Supabase Client (COMPLETE)

Created Supabase client setup with both server and browser clients:

1. **Browser Client** (`src/lib/supabase/client.ts`)
   - Uses public ANON_KEY
   - Operates under Row-Level Security (RLS)
   - For Client Components and interactive features

2. **Server Client** (`src/lib/supabase/server.ts`)
   - Uses secret SERVICE_ROLE_KEY
   - Can bypass RLS (admin power)
   - For Server Components and API Routes

3. **Middleware** (`src/lib/supabase/middleware.ts`)
   - Handles automatic session token refresh
   - Keeps cookies in sync between server/browser
   - Critical for magic link authentication

4. **TypeScript Types** (`src/types/database.ts`)
   - Auto-generated style type definitions
   - Full type safety for database operations
   - Includes schema: images, share_links, profiles

5. **Documentation** (`docs/supabase-client-setup.md`)
   - Detailed explanations of both clients
   - Decision tree for choosing right client
   - RLS overview and security considerations

### Step 3: Implement Magic Link Authentication (COMPLETE)

Complete magic link auth flow with 7-step process:

1. **Middleware** (`src/middleware.ts`)
   - Route protection for /gallery, /admin, /api routes
   - Session token refresh on every request
   - Keeps users logged in seamlessly

2. **Auth Callback** (`src/app/(auth)/auth/callback/route.ts`)
   - Exchanges magic link code for session
   - One-time-use token validation
   - Redirects to /gallery on success or /login on error

3. **Auth Utilities** (`src/lib/auth/index.ts`)
   - `getCurrentUser()` - Get logged-in user
   - `requireAuth()` - Enforce authentication
   - `signOut()` - Clear session and redirect
   - `getUserProfile()` - Get user role (viewer/admin)

4. **Login Form** (`src/components/auth/LoginForm.tsx`)
   - Email input with magic link request
   - State management (idle → loading → success/error)
   - Supabase Auth integration via `signInWithOtp()`

5. **User Profile Display** (`src/components/auth/UserProfile.tsx`)
   - Shows logged-in user's email
   - Displays role (Admin 👤 or Viewer 👁)
   - Sign out button integration

6. **Sign Out Button** (`src/components/auth/SignOutButton.tsx`)
   - Server Action form submission
   - Clears session and redirects to /login

7. **Updated Login Page** (`src/app/(auth)/login/page.tsx`)
   - Integrates LoginForm component
   - Shows magic link process info

8. **Documentation** (`docs/magic-link-auth-guide.md`)
   - 7-step authentication flow diagram
   - Security considerations and best practices
   - Testing instructions and troubleshooting

### Step 4: Build Gallery Grid Component (COMPLETE)

Complete gallery grid system with responsive layout and pagination:

1. **Image Card** (`src/components/gallery/ImageCard.tsx`)
   - Square aspect ratio with responsive images
   - Hover effects: overlay + 5% scale
   - Title overlay on hover
   - Placeholder icon for missing images
   - Keyboard accessible

2. **Image Grid** (`src/components/gallery/ImageGrid.tsx`)
   - Responsive columns: 2 → 3 → 4 → 5
   - Adaptive gap: 8px (mobile) → 12-16px (desktop)
   - Loading skeleton states
   - Empty state messaging
   - Minimal, clean design

3. **Pagination Hook** (`src/hooks/useGalleryPagination.ts`)
   - Manages pagination state (current page, total pages)
   - Provides navigation methods (nextPage, previousPage, etc.)
   - Calculates start/end indexes for array slicing
   - Reusable for any paginated list

4. **Pagination Controls** (`src/components/gallery/PaginationControls.tsx`)
   - Previous/Next buttons with disabled states
   - Page indicator (e.g., "Page 2 of 5")
   - LoadMoreButton alternative for infinite scroll
   - Subtle, unobtrusive design

5. **Placeholder Generator** (`src/lib/gallery/placeholder.ts`)
   - Generates 100 realistic development images
   - Uses Unsplash for real image URLs
   - Includes realistic metadata (titles, keywords, dates)
   - Easy to replace with real B2 images later

6. **Updated Types** (`src/types/index.ts`)
   - Added optional `imageUrl` field to ImageData
   - Supports both placeholder and real images

7. **Gallery Page** (`src/app/(gallery)/gallery/page.tsx`)
   - Loads placeholder images on mount
   - Manages pagination and image slicing
   - Shows 20 images per page
   - Ready to replace with B2 images
   - Handles loading and pagination states

8. **Documentation** (`docs/gallery-grid-guide.md`)
   - Complete architecture overview
   - Component-by-component explanation
   - Design philosophy and decisions
   - Responsive behavior breakdown
   - Troubleshooting and future enhancements

### Step 1: Initialize Next.js Structure (COMPLETE)

Created the complete Next.js 15 project with:

1. **Configuration Files**
   - `package.json` - Next.js 15, React 19, Supabase client, AWS SDK, Tailwind v4, Vitest
   - `tsconfig.json` - TypeScript strict mode, path alias `@/*`
   - `next.config.ts` - Image optimization for B2, security headers, typed routes
   - `postcss.config.js` - Tailwind CSS v4 with `@tailwindcss/postcss`
   - `eslint.config.mjs` - ESLint 9 flat config with Next.js rules
   - `.prettierrc` - No semicolons, single quotes, Tailwind plugin

2. **App Router Structure** (`src/app/`)
   - `layout.tsx` - Root layout with metadata
   - `page.tsx` - Landing page (/)
   - `(auth)/` - Route group for authentication
     - `layout.tsx` - Centered auth layout
     - `login/page.tsx` - Login page (/login)
     - `auth/callback/route.ts` - Magic link callback
   - `(gallery)/` - Route group for protected pages
     - `layout.tsx` - Gallery layout with header
     - `gallery/page.tsx` - Main gallery (/gallery)
   - `share/[token]/page.tsx` - Dynamic share link route
   - `api/health/route.ts` - Health check endpoint

3. **Components** (`src/components/`)
   - `ui/` - Button, Input, Spinner (base components)
   - `gallery/` - Placeholder for gallery components
   - `auth/` - Placeholder for auth components
   - `admin/` - Placeholder for admin components
   - `shared/` - Placeholder for shared components

4. **Library** (`src/lib/`)
   - `utils.ts` - `cn()` utility for Tailwind class merging
   - `supabase/` - Placeholder for Supabase clients
   - `b2/` - Placeholder for B2 client
   - `embeddings/` - Placeholder for embedding service

5. **Types** (`src/types/index.ts`)
   - ImageData, SearchResult, ShareLink, UserProfile, ApiResponse

6. **Styles** (`src/styles/globals.css`)
   - Tailwind v4 with custom theme, animations, utilities

### Verification

- `npm install` - 686 packages installed
- `npm run type-check` - Passes
- `npm run dev` - Server starts at http://localhost:3000
- `/api/health` - Returns JSON health check

## Two-VPS Architecture

| VPS | Role | Specs | Services |
|-----|------|-------|----------|
| **vps2** | App VPS | 2 cores, 8GB RAM, 100GB | Next.js, Python Embedding, Caddy |
| **vps8** | Homelab | 8 cores, 32GB RAM, 400GB | Supabase, Ollama, existing infra |

### Service Endpoints

| Service | URL/Connection |
|---------|----------------|
| Supabase API | https://supabase.haugaard.dev |
| Supabase DB | postgresql://postgres:***@72.60.27.146:5432/kline_martin_photos |
| Ollama | https://ollama.haugaard.dev |
| Backblaze B2 | s3.us-west-004.backblazeb2.com |
| App (production) | https://kline-martin-photos.com |

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS 4.x (understated aesthetic) |
| Backend API | Next.js API Routes |
| Embedding Service | Python + FastAPI + SigLIP ViT-B/16 |
| Database | PostgreSQL + pgvector 0.8.0 |
| Auth | Supabase Auth (magic links) |
| Vector Search | pgvector (native PostgreSQL) |
| Text Embeddings | Ollama + nomic-embed-text |
| Image Storage | Backblaze B2 |

## Files Created This Session

| File | Purpose |
|------|---------|
| `package.json` | Dependencies + npm scripts |
| `tsconfig.json` | TypeScript strict mode config |
| `next.config.ts` | Next.js configuration |
| `postcss.config.js` | Tailwind CSS v4 PostCSS |
| `eslint.config.mjs` | ESLint 9 config |
| `.prettierrc` / `.prettierignore` | Prettier config |
| `src/app/**` | App Router pages and layouts |
| `src/components/ui/**` | Base UI components |
| `src/lib/utils.ts` | Utility functions |
| `src/types/index.ts` | TypeScript type definitions |
| `src/styles/globals.css` | Global styles + Tailwind theme |

## 12-Step Guided Setup Progress

1. [x] **Initialize Next.js Structure** - COMPLETE
2. [x] **Configure Supabase Client** - COMPLETE
3. [x] **Implement Magic Link Authentication** - COMPLETE
4. [x] **Build Gallery Grid Component** - COMPLETE
5. [ ] **Add Lightbox Viewer** <- NEXT
6. [ ] Connect Backblaze B2 Storage
7. [ ] Implement Search Foundation
8. [ ] Set Up Python Embedding Service
9. [ ] Add Semantic Search
10. [ ] Implement Share Links
11. [ ] Add Admin Keyword Management
12. [ ] Testing Setup

## Key Decisions

- **Work on `main`** during V0.1 (no branches until baseline is working)
- **Understated UI** - clean, minimal, no visual clutter
- **Local sample data first** - build with local files, add B2 integration later
- **Date sorting not meaningful** - rely on keywords and semantic search

## Key Files

- [CLAUDE.md](../CLAUDE.md) - Project configuration + Guided Setup steps
- [.docs/PROJECT-MODE.md](../.docs/PROJECT-MODE.md) - Workflow mode (BALANCED)
- [.docs/brief-kline-martin-photos.md](../.docs/brief-kline-martin-photos.md) - Project brief
- [.docs/tech-stack-decision-v2.md](../.docs/tech-stack-decision-v2.md) - Tech stack decision
- [.docs/deployment-strategy.md](../.docs/deployment-strategy.md) - Deployment strategy

## Workflow Progress

```text
[x] Phase 0: Project Brief (project-brief-writer)
[x] Phase 1: Tech Stack Advisor (complete)
[x] Phase 2: Deployment Strategy (complete)
[x] Phase 3: Project Foundation (project-spinup) - COMPLETE
[x] Step 1: Initialize Next.js Structure - COMPLETE
[x] Step 2: Configure Supabase Client - COMPLETE
[x] Step 3: Implement Magic Link Authentication - COMPLETE
[x] Step 4: Build Gallery Grid Component - COMPLETE
[ ] Step 5-12: Guided Setup - IN PROGRESS
[ ] Phase 4: Test Strategy (test-orchestrator) - optional
[ ] Phase 5: Deployment (deploy-guide)
[ ] Phase 6: CI/CD (ci-cd-implement) - optional
```

## Files Created in This Session

**Step 2 (Supabase Clients)**:

- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/supabase/middleware.ts` - Session refresh middleware
- `src/types/database.ts` - TypeScript database types
- `docs/supabase-client-setup.md` - Comprehensive guide

**Step 3 (Magic Link Auth)**:

- `src/middleware.ts` - Route protection and token refresh
- `src/app/(auth)/auth/callback/route.ts` - Magic link callback handler
- `src/lib/auth/index.ts` - Auth utility functions
- `src/components/auth/LoginForm.tsx` - Magic link form
- `src/components/auth/UserProfile.tsx` - Profile display
- `src/components/auth/SignOutButton.tsx` - Sign out button
- `docs/magic-link-auth-guide.md` - Authentication guide

**Step 4 (Gallery Grid)**:

- `src/components/gallery/ImageCard.tsx` - Individual image card
- `src/components/gallery/ImageGrid.tsx` - Responsive grid layout
- `src/components/gallery/PaginationControls.tsx` - Pagination controls
- `src/hooks/useGalleryPagination.ts` - Pagination state hook
- `src/lib/gallery/placeholder.ts` - Development image generator
- `src/app/(gallery)/gallery/page.tsx` - Gallery page (updated)
- `src/types/index.ts` - Type definitions (updated)
- `docs/gallery-grid-guide.md` - Gallery guide

**Total**: 27 new files created + 3 updated

## Next Action

User ready for: **Step 5 (Add Lightbox Viewer)** to view full-size images
