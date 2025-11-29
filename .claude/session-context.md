# Session Context: Kline-Martin Photos

## Current Status

**Phase:** Guided Setup - Step 1 COMPLETE
**Mode:** BALANCED
**Next:** Step 2 (Configure Supabase Client)

## What We've Done This Session

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
2. [ ] **Configure Supabase Client** <- NEXT
3. [ ] Implement Magic Link Authentication
4. [ ] Build Gallery Grid Component
5. [ ] Add Lightbox Viewer
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
[ ] Step 2-12: Guided Setup - IN PROGRESS
[ ] Phase 4: Test Strategy (test-orchestrator) - optional
[ ] Phase 5: Deployment (deploy-guide)
[ ] Phase 6: CI/CD (ci-cd-implement) - optional
```

## Next Action

User says: **"Let's start Step 2"** to configure Supabase client
