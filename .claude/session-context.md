# Session Context: Kline-Martin Photos

## Current Status

**Phase:** Guided Setup - Steps 2, 3, 4, 5 COMPLETE
**Mode:** BALANCED
**Next:** Step 6 (Connect Backblaze B2 Storage)

## What We've Done This Session

### Step 5: Add Lightbox Viewer (COMPLETE)

Complete lightbox component with keyboard navigation and swipe support:

1. **Lightbox Hook** (`src/hooks/useLightbox.ts`)
   - Manages open/close state and current image index
   - Navigation methods: open, close, next, previous
   - Tracks canGoNext and canGoPrevious states
   - Returns currentImage for display

2. **Keyboard Navigation Hook** (`src/hooks/useKeyboardNavigation.ts`)
   - Arrow keys for next/previous navigation
   - Escape key to close lightbox
   - Only active when lightbox is open
   - Proper cleanup on unmount

3. **Lightbox Component** (`src/components/gallery/Lightbox.tsx`)
   - Full-screen overlay with dark backdrop
   - Centered image with max-width/height constraints
   - Navigation arrows (left/right) with hover states
   - Close button (X) in top-right corner
   - Touch/swipe support for mobile devices
   - Keyboard navigation integration
   - Click outside to close

4. **Gallery Page Integration** (`src/app/(gallery)/gallery/page.tsx`)
   - Added useLightbox hook
   - Images open in lightbox when clicked
   - Navigation between images works correctly

### Authentication Debugging & Fixes (COMPLETE)

Resolved multiple issues with self-hosted Supabase authentication:

1. **Database Connection Fix**
   - Changed DATABASE_URL from `/kline_martin_photos` to `/postgres`
   - Self-hosted Supabase GoTrue requires the shared `postgres` database
   - Updated `.env.local` with correct connection string

2. **GoTrue NULL Value Fix**
   - Error: `sql: Scan error on column index 8, name "email_change": converting NULL to string is unsupported`
   - Root cause: NULL values in auth.users columns incompatible with GoTrue
   - Fixed with SQL updates on vps8:
     ```sql
     UPDATE auth.users SET email_change = '' WHERE email_change IS NULL;
     UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;
     UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
     ```

3. **SMTP Setup with Resend**
   - GoTrue was configured to use non-existent `supabase-mail` container
   - Set up Resend account (resend.com)
   - Added DNS records for domain verification (haugaard.dev via Cloudflare)
   - Created API key for SMTP authentication
   - Updated Supabase .env on vps8:
     ```
     SMTP_HOST=smtp.resend.com
     SMTP_PORT=465
     SMTP_USER=resend
     SMTP_PASS=re_xxxxxxxx
     SMTP_SENDER_EMAIL=noreply@haugaard.dev
     ```
   - Restarted GoTrue container: `docker compose restart supabase-auth`

4. **Magic Link Now Working**
   - Users can enter email and receive magic link
   - Link contains OTP code for authentication

### Next.js Image Configuration Fix

- Added `images.unsplash.com` to `next.config.ts` remotePatterns
- Required for placeholder images from Unsplash during development

### Known Issue: Auth Redirect

**Issue:** Magic links redirect to Supabase dashboard instead of the app

**Fix Required:** On vps8, update Supabase .env:
```
SITE_URL=http://localhost:3000
ADDITIONAL_REDIRECT_URLS=http://localhost:3000/auth/callback
```
Then restart GoTrue: `docker compose restart supabase-auth`

## Previous Steps (Completed Earlier)

### Step 4: Build Gallery Grid Component (COMPLETE)

- ImageCard with hover effects and placeholder support
- ImageGrid with responsive columns (2 → 3 → 4 → 5)
- PaginationControls with page navigation
- useGalleryPagination hook for state management
- Placeholder generator for 100 development images

### Step 3: Implement Magic Link Authentication (COMPLETE)

- Route protection middleware
- Auth callback handler
- Auth utility functions (getCurrentUser, requireAuth, signOut, getUserProfile)
- LoginForm component
- UserProfile and SignOutButton components

### Step 2: Configure Supabase Client (COMPLETE)

- Browser client (client.ts)
- Server client (server.ts)
- Middleware helper (middleware.ts)
- TypeScript database types

### Step 1: Initialize Next.js Structure (COMPLETE)

- Full Next.js 15 project with App Router
- Tailwind CSS 4.x configuration
- TypeScript strict mode
- ESLint and Prettier setup

## Two-VPS Architecture

| VPS | Role | Specs | Services |
|-----|------|-------|----------|
| **vps2** | App VPS | 2 cores, 8GB RAM, 100GB | Next.js, Python Embedding, Caddy |
| **vps8** | Homelab | 8 cores, 32GB RAM, 400GB | Supabase, Ollama, existing infra |

### Service Endpoints

| Service | URL/Connection |
|---------|----------------|
| Supabase API | https://supabase.haugaard.dev |
| Supabase DB | postgresql://postgres:***@72.60.27.146:5432/postgres |
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
| Email | Resend SMTP |

## 12-Step Guided Setup Progress

1. [x] **Initialize Next.js Structure** - COMPLETE
2. [x] **Configure Supabase Client** - COMPLETE
3. [x] **Implement Magic Link Authentication** - COMPLETE
4. [x] **Build Gallery Grid Component** - COMPLETE
5. [x] **Add Lightbox Viewer** - COMPLETE
6. [ ] **Connect Backblaze B2 Storage** <- NEXT
7. [ ] Implement Search Foundation
8. [ ] Set Up Python Embedding Service
9. [ ] Add Semantic Search
10. [ ] Implement Share Links
11. [ ] Add Admin Keyword Management
12. [ ] Testing Setup

## Files Created/Modified This Session

**Step 5 (Lightbox Viewer)**:

- `src/hooks/useLightbox.ts` - NEW - Lightbox state management
- `src/hooks/useKeyboardNavigation.ts` - NEW - Keyboard controls
- `src/components/gallery/Lightbox.tsx` - NEW - Full lightbox component
- `src/app/(gallery)/gallery/page.tsx` - UPDATED - Lightbox integration

**Configuration Updates**:

- `.env.local` - UPDATED - Changed DATABASE_URL to use `postgres` database
- `next.config.ts` - UPDATED - Added `images.unsplash.com` to remotePatterns

**Infrastructure (on vps8)**:

- Supabase .env - UPDATED - Resend SMTP configuration

## Key Decisions

- **Work on `main`** during V0.1 (no branches until baseline is working)
- **Understated UI** - clean, minimal, no visual clutter
- **Local sample data first** - build with local files, add B2 integration later
- **Resend for email** - Reliable SMTP service for magic links
- **Shared postgres database** - Required for self-hosted Supabase GoTrue

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
[x] Step 5: Add Lightbox Viewer - COMPLETE
[ ] Step 6-12: Guided Setup - IN PROGRESS
[ ] Phase 4: Test Strategy (test-orchestrator) - optional
[ ] Phase 5: Deployment (deploy-guide)
[ ] Phase 6: CI/CD (ci-cd-implement) - optional
```

## Next Action

**Before Step 6:** Fix auth redirect by updating SITE_URL on vps8

**Then:** Step 6 (Connect Backblaze B2 Storage) to display real images from B2
