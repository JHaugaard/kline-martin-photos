# Kline-Martin Photos

> A private family photo gallery with semantic search capabilities, enabling ~20 family members to browse, search, and share ~1,100 curated family images using natural language queries.

**Status**: Active Development | **Developer**: John | **Philosophy**: Learning-Focused, Best Practices

---

## Developer Profile

**Experience**: Hobbyist developer, beginner-to-intermediate level
**Learning Goals**: Deep understanding of full-stack development, semantic search with embeddings, modern React patterns
**Development Approach**: Heavy reliance on Claude Code for implementation, learning through guided development
**Common Tasks**: Feature implementation, debugging, refactoring, testing, deployment

### Skill Location

When there is a specific reference to a Claude Skill, or the context indicates that a Claude Skill should be invoked, note that all skills used in this project are personal skills and located at: /Users/john/.claude/skills

---

## Project Overview

### What This Project Does

A searchable family photo gallery that combines:
- **Keyword search** - Match against existing metadata/tags
- **Semantic search** - Natural language queries like "Christmas at the cabin" or "beach vacation"
- **Clean gallery UI** - Responsive grid, lightbox viewing, infinite scroll
- **Share links** - Generate public links to individual photos (metadata-free)
- **Admin features** - Keyword management for designated users
- **Magic link auth** - Passwordless authentication for invited family members

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js 15 (App Router) | React 19, Server Components |
| **Styling** | Tailwind CSS 4.x | Understated, clean aesthetic |
| **Backend API** | Next.js API Routes | Server Actions where appropriate |
| **Database** | PostgreSQL 15+ | Via Supabase on vps8 |
| **Vector Search** | pgvector 0.8.0 | Native PostgreSQL extension |
| **Auth** | Supabase Auth | Magic link authentication |
| **Access Control** | Row-Level Security | PostgreSQL RLS policies |
| **Image Storage** | Backblaze B2 | S3-compatible, ~1,100 images |
| **Image Embeddings** | SigLIP ViT-B/16 | 512-dim vectors, Python/FastAPI service |
| **Text Embeddings** | Ollama + nomic-embed-text | 768-dim vectors, via HTTPS on vps8 |

### Architecture Decisions

1. **pgvector over dedicated vector DB** - Single data store for metadata, auth, and vectors. ~1,100 images is well within pgvector's range.

2. **Separate embedding service** - Python/FastAPI service for SigLIP, decoupled from Next.js app. Easier to update/restart independently.

3. **Two-VPS deployment** - App on vps2, backend services (Supabase, Ollama) on vps8. Clean separation of concerns.

4. **Supabase for auth + database** - Magic link auth built-in, pgvector support, RLS for permissions.

---

## Development Environment

### Computers & Sync
- **Machines**: MacBook Pro, Mac Mini
- **Sync**: iCloud, portable SSDs, GitHub
- **IDE**: VS Code with relevant extensions

### Local Development Prerequisites

- Node.js 20+ (LTS)
- pnpm (preferred) or npm
- Docker Desktop
- Python 3.11+ (for embedding service)
- Git

### First-Time Setup

```bash
# Clone and enter project
cd /Volumes/dev/develop/kline-martin-photos

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start Docker services (PostgreSQL for local dev)
docker compose up -d

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Project Structure

```
kline-martin-photos/
├── .claude/              # Claude Code session files
├── .docs/                # Workflow handoff documents
├── docs/                 # Project documentation
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Auth routes (login, callback)
│   │   ├── (gallery)/    # Protected gallery routes
│   │   ├── api/          # API routes
│   │   ├── share/        # Public share link pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Landing/redirect
│   ├── components/       # React components
│   │   ├── gallery/      # Gallery-specific components
│   │   ├── ui/           # Base UI components
│   │   └── shared/       # Shared components
│   ├── lib/              # Utilities and clients
│   │   ├── supabase/     # Supabase client setup
│   │   ├── b2/           # Backblaze B2 client
│   │   └── embeddings/   # Embedding service client
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── embedding-service/    # Python FastAPI service
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   ├── embeddings.py # SigLIP model wrapper
│   │   └── config.py     # Configuration
│   ├── requirements.txt
│   └── Dockerfile
├── tests/                # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker-compose.yml    # Local development services
├── .env.example          # Environment template
├── .env.local            # Local environment (git-ignored)
└── CLAUDE.md             # This file
```

---

## Infrastructure & Hosting

### Two-VPS Architecture

**vps2 (App VPS)** - srv993275.hstgr.cloud / 31.97.131.163
- 2 cores, 8GB RAM, 100GB storage
- Hosts: Next.js app, Python embedding service, Caddy
- Domain: photos.haugaard.dev

**vps8 (Homelab)** - 72.60.27.146
- 8 cores, 32GB RAM, 400GB storage
- Hosts: Supabase (PostgreSQL + pgvector), Ollama, Caddy
- Already running, shared infrastructure

### Service Endpoints

| Service | URL/Connection |
|---------|----------------|
| Supabase API | https://supabase.haugaard.dev |
| Supabase DB | postgresql://postgres:***@72.60.27.146:5432/kline_martin_photos |
| Ollama | https://ollama.haugaard.dev |
| Backblaze B2 | s3.us-west-004.backblazeb2.com |
| App (production) | https://kline-martin-photos.com |

### Backblaze B2 (Image Storage)

- **Bucket**: Contains ~1,100 images (production)
- **Access**: S3-compatible API with application keys

### Local Sample Data

For V0.1 development, 10 sample images with JSON metadata are available locally:

- **Location**: `kline-martin-photos/` subdirectory
- **Files**: 10 JPEGs + corresponding `.json` metadata files
- **Metadata includes**: keywords, dates, dimensions, SmugMug origins

This allows offline development without B2 API calls during prototyping.

---

## Development Workflow

### Git Branching

**During V0.1 development:** Work directly on `main`. This keeps things simple while building the foundation.

**After V0.1 is functional:** Introduce branching for experimentation:

```text
main ────────────────────────────────────────►
       │                             │
       └── dev ─────────────────────►│
              │        │
              └─ feat/ui-tweaks
                       └─ experiment/alt-search
```

- **main**: Working code
- **dev**: Integration branch (post-V0.1)
- **feat/*, experiment/***: For trying alternatives without risk

### Commit Convention

Follow conventional commits:
```
type(scope): description

feat(gallery): add infinite scroll to image grid
fix(auth): handle expired magic link gracefully
chore(deps): update Next.js to 15.1.0
docs(readme): add local setup instructions
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`

### Development Cycle

1. Create feature branch from dev: `git checkout -b feat/feature-name`
2. Implement with small, focused commits
3. Test locally (unit + manual)
4. Push and create PR to dev
5. Merge to dev after review
6. Periodically merge dev to main for releases

---

## Code Conventions

### File Organization

- **Components**: PascalCase (`ImageGrid.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE in `constants.ts`
- **Types**: PascalCase, suffix with type (`ImageData`, `SearchResult`)

### Component Structure

```tsx
// 1. Imports (external, then internal)
import { useState } from 'react'
import { cn } from '@/lib/utils'

// 2. Types
interface ImageCardProps {
  image: ImageData
  onClick: () => void
}

// 3. Component
export function ImageCard({ image, onClick }: ImageCardProps) {
  // hooks first
  const [isLoaded, setIsLoaded] = useState(false)

  // handlers
  const handleClick = () => onClick()

  // render
  return (...)
}
```

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Prefer Server Components where possible
- Use `'use client'` only when necessary
- Zod for runtime validation
- Error boundaries for graceful failures

---

## Common Commands

### Development

```bash
# Start dev server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Run specific test file
pnpm test path/to/test.ts
```

### Database

```bash
# Generate migration
pnpm db:generate

# Run migrations
pnpm db:migrate

# Reset database (destructive)
pnpm db:reset

# Open Supabase Studio (if local)
pnpm db:studio
```

### Docker

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after changes
docker compose up -d --build
```

### Embedding Service

```bash
# Start embedding service (development)
cd embedding-service
python -m uvicorn app.main:app --reload --port 8001

# Test embedding endpoint
curl -X POST http://localhost:8001/embed \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://..."}'
```

---

## Project-Specific Notes

### Database Schema

```sql
-- Core tables (conceptual, actual in migrations)

-- Images with vectors
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  keywords TEXT[],
  image_embedding vector(512),  -- SigLIP
  text_embedding vector(768),   -- nomic-embed-text
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Share links for public access
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES images(id),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- User profiles with roles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  role TEXT DEFAULT 'viewer',  -- 'viewer' or 'admin'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Search Flow

1. User enters query: "Christmas at the cabin"
2. Embed query via Ollama → 768-dim vector
3. Query: `ORDER BY text_embedding <=> query_vector LIMIT N`
4. Return matching images with metadata

### Image URL Generation

Images are stored in Backblaze B2. For display:
- Generate signed URLs for authenticated users
- Use Cloudflare CDN if caching needed
- Thumbnails: Consider generating on-demand or pre-computed

### Authentication Flow

1. User enters email on login page
2. Supabase sends magic link to email
3. User clicks link → redirected to `/auth/callback`
4. Callback exchanges token for session
5. User redirected to gallery

### Environment Variables

See `.env.example` for full list. Critical variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Backblaze B2
B2_APPLICATION_KEY_ID=
B2_APPLICATION_KEY=
B2_BUCKET_NAME=
B2_ENDPOINT=

# Embedding Service
EMBEDDING_SERVICE_URL=
OLLAMA_BASE_URL=
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured on vps2
- [ ] Database migrations run on production
- [ ] Firewall rule: vps8 allows vps2 on port 5432
- [ ] DNS: photos.haugaard.dev → vps2 IP
- [ ] B2 bucket created with application key

### Deployment Workflow

1. Merge dev → main
2. SSH to vps2
3. Pull latest code
4. Run migrations
5. Rebuild and restart containers
6. Verify health checks

### Rollback

```bash
# On vps2
git checkout <previous-commit>
docker compose up -d --build
```

---

## Resources & References

### Project Documentation
- [Project Brief](.docs/brief-kline-martin-photos.md)
- [Tech Stack Decision](.docs/tech-stack-decision-v2.md)
- [Deployment Strategy](.docs/deployment-strategy.md)
- [Image Embedding Research](docs/image-embedding-stack.md)
- [Semantic Search Pipeline](docs/image-semantic-search-pipeline.md)

### External Resources
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SigLIP on Hugging Face](https://huggingface.co/google/siglip-base-patch16-224)

### Learning Resources
- Vector similarity search concepts
- Next.js App Router patterns
- Supabase Row-Level Security
- Magic link authentication flows

---

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in .env.local
- Verify vps8 firewall allows your IP
- Test connection: `psql $DATABASE_URL`

### "Embedding service not responding"
- Check if Python service is running: `curl http://localhost:8001/health`
- Check logs: `docker compose logs embedding-service`
- Verify model is downloaded (first run takes time)

### "Magic link not received"
- Check spam folder
- Verify SMTP configured in Supabase dashboard
- Check Supabase Auth logs

### "Images not loading"
- Verify B2 credentials in .env.local
- Check CORS settings on B2 bucket
- Test signed URL generation manually

---

## Next Steps (Guided Setup)

You now have the project foundation. Complete the setup by asking Claude Code to build out the structure step-by-step.

### Learning Philosophy

Each step teaches about a specific part of the stack. Take your time, review what gets created, ask questions about why things are structured this way.

**Estimated total time:** 3-4 hours (can be spread across sessions)

---

### Step 1: Initialize Next.js Structure
**Time:** ~20 minutes | **Learning:** Next.js 15 App Router, project configuration

**What you'll learn**: How Next.js 15 projects are organized, what each config file does, the App Router file conventions.

**Say to Claude Code**:
```
Set up the Next.js 15 structure with App Router, TypeScript strict mode, and Tailwind CSS v4 as specified in CLAUDE.md. Create the base directory structure under src/app/ and src/components/. Please explain the purpose of each major file and directory as you create them.
```

**What will be created**:
- package.json with dependencies
- next.config.ts, tsconfig.json
- tailwind.config.ts, postcss.config.js
- src/app/layout.tsx, src/app/page.tsx
- src/components/ui/ base structure
- ESLint and Prettier configuration

**Verification**: `pnpm dev` starts without errors, visit http://localhost:3000

---

### Step 2: Configure Supabase Client
**Time:** ~15 minutes | **Learning:** Supabase client setup, Server vs Client components

**What you'll learn**: How to configure Supabase for both server and client components, environment variable handling in Next.js.

**Say to Claude Code**:
```
Set up the Supabase client configuration with both server and browser clients as specified in CLAUDE.md. Include proper TypeScript types for the database schema. Explain the difference between server and client Supabase usage.
```

**What will be created**:
- src/lib/supabase/client.ts (browser client)
- src/lib/supabase/server.ts (server client)
- src/lib/supabase/middleware.ts (session refresh)
- src/types/database.ts (type definitions)

**Verification**: Import clients without TypeScript errors

---

### Step 3: Implement Magic Link Authentication
**Time:** ~30 minutes | **Learning:** Supabase Auth, protected routes, middleware

**What you'll learn**: Magic link authentication flow, Next.js middleware for auth, protected route patterns.

**Say to Claude Code**:
```
Implement magic link authentication using Supabase Auth as specified in CLAUDE.md. Create login page, auth callback handler, and middleware for protecting routes. Include a simple profile display to verify the user is logged in.
```

**What will be created**:
- src/app/(auth)/login/page.tsx
- src/app/(auth)/auth/callback/route.ts
- src/middleware.ts (route protection)
- src/components/auth/LoginForm.tsx
- src/components/auth/UserProfile.tsx

**Verification**: Can send magic link, click it, see logged-in state

---

### Step 4: Build Gallery Grid Component
**Time:** ~30 minutes | **Learning:** React Server Components, image optimization, responsive design

**What you'll learn**: Server Components for data fetching, Next.js Image optimization, Tailwind responsive grid.

**Say to Claude Code**:
```
Create the gallery grid component with responsive layout as specified in CLAUDE.md. Use placeholder images initially (we'll connect to B2 later). Implement infinite scroll or pagination. Keep the design understated and clean - minimal borders, subtle shadows, no visual clutter.
```

**What will be created**:
- src/app/(gallery)/gallery/page.tsx
- src/components/gallery/ImageGrid.tsx
- src/components/gallery/ImageCard.tsx
- src/components/gallery/LoadMoreButton.tsx (or infinite scroll hook)

**Verification**: Grid displays placeholder images, responsive on mobile

---

### Step 5: Add Lightbox Viewer
**Time:** ~25 minutes | **Learning:** Client components, state management, keyboard navigation

**What you'll learn**: When to use client components, managing UI state, accessibility patterns.

**Say to Claude Code**:
```
Create a lightbox component for full-size image viewing as specified in CLAUDE.md. Include keyboard navigation (arrow keys, escape to close), swipe support for mobile, and clean minimal styling. Should work with the gallery grid.
```

**What will be created**:
- src/components/gallery/Lightbox.tsx
- src/hooks/useLightbox.ts
- src/hooks/useKeyboardNavigation.ts
- Updated ImageGrid to integrate lightbox

**Verification**: Click image → lightbox opens, navigate with keys, escape closes

---

### Step 6: Connect Backblaze B2 Storage
**Time:** ~25 minutes | **Learning:** S3-compatible APIs, signed URLs, environment configuration

**What you'll learn**: Working with S3-compatible storage, generating secure signed URLs, handling credentials safely.

**Say to Claude Code**:
```
Set up the Backblaze B2 client for image storage as specified in CLAUDE.md. Create utilities for generating signed URLs for both thumbnails and full-size images. We have 10 sample images already in B2 - let's use those for testing.
```

**Provide when asked**: B2 credentials (application key ID, secret, bucket name, endpoint)

**What will be created**:
- src/lib/b2/client.ts
- src/lib/b2/signed-urls.ts
- src/app/api/images/route.ts (list images)
- Updated gallery to fetch real images

**Verification**: Gallery shows actual images from B2

---

### Step 7: Implement Search Foundation
**Time:** ~30 minutes | **Learning:** API routes, database queries, search UX patterns

**What you'll learn**: Next.js API routes, Supabase queries, debouncing and search UI patterns.

**Say to Claude Code**:
```
Implement the search foundation with keyword-based search as specified in CLAUDE.md. Create search input component, API route for searching, and results display. We'll add semantic search in a later step - this is keyword/metadata search first.
```

**What will be created**:
- src/components/gallery/SearchBar.tsx
- src/app/api/search/route.ts
- src/hooks/useSearch.ts (with debouncing)
- Updated gallery page with search integration

**Verification**: Can search by keywords, results filter in real-time

---

### Step 8: Set Up Python Embedding Service
**Time:** ~35 minutes | **Learning:** FastAPI basics, ML model loading, Docker multi-service setup

**What you'll learn**: Building a Python API service, loading ML models, coordinating multiple Docker services.

**Say to Claude Code**:
```
Create the Python embedding service with FastAPI and SigLIP as specified in CLAUDE.md. Include a Dockerfile and integrate with docker-compose.yml. The service should expose an endpoint to generate embeddings for images.
```

**What will be created**:
- embedding-service/app/main.py
- embedding-service/app/embeddings.py
- embedding-service/app/config.py
- embedding-service/requirements.txt
- embedding-service/Dockerfile
- Updated docker-compose.yml

**Verification**: `curl http://localhost:8001/health` returns OK

---

### Step 9: Add Semantic Search
**Time:** ~30 minutes | **Learning:** Vector similarity search, pgvector queries, hybrid search

**What you'll learn**: How vector search works, pgvector operators, combining keyword and semantic search.

**Say to Claude Code**:
```
Implement semantic search using pgvector as specified in CLAUDE.md. Create the embedding generation flow for queries (via Ollama), and update the search API to use vector similarity. Combine with keyword search for hybrid results.
```

**What will be created**:
- src/lib/embeddings/client.ts (call embedding service)
- src/lib/embeddings/ollama.ts (text embeddings)
- Updated src/app/api/search/route.ts (vector search)
- Database migration for vector indexes

**Verification**: Search "beach vacation" finds beach photos even if not tagged

---

### Step 10: Implement Share Links
**Time:** ~20 minutes | **Learning:** Dynamic routes, public vs. authenticated access, token generation

**What you'll learn**: Next.js dynamic routes, generating secure tokens, public page rendering.

**Say to Claude Code**:
```
Implement share link functionality as specified in CLAUDE.md. Users should be able to generate a shareable link to any image. The shared page shows just the image (no metadata, no gallery access). Links should be simple tokens.
```

**What will be created**:
- src/app/share/[token]/page.tsx
- src/app/api/share/route.ts (create link)
- src/components/gallery/ShareButton.tsx
- Database table for share links

**Verification**: Generate link, open in incognito, see single image

---

### Step 11: Add Admin Keyword Management
**Time:** ~25 minutes | **Learning:** Role-based access, Row-Level Security, form handling

**What you'll learn**: Implementing admin-only features, Supabase RLS policies, CRUD operations.

**Say to Claude Code**:
```
Implement admin keyword management as specified in CLAUDE.md. Admins should see an edit button on images that opens a keyword editor. Regular users should not see this. Use Supabase RLS to enforce permissions server-side.
```

**What will be created**:
- src/components/admin/KeywordEditor.tsx
- src/app/api/images/[id]/keywords/route.ts
- Database RLS policies for admin role
- Updated Lightbox with admin controls

**Verification**: Admin can edit keywords, regular user cannot

---

### Step 12: Testing Setup
**Time:** ~20 minutes | **Learning:** Testing strategies, Vitest configuration, component testing

**What you'll learn**: Setting up a test framework, writing component tests, testing API routes.

**Say to Claude Code**:
```
Set up the testing framework with Vitest as specified in CLAUDE.md. Create example tests for the search functionality and a gallery component. Include testing utilities for Supabase mocking.
```

**What will be created**:
- vitest.config.ts
- tests/setup.ts
- tests/unit/search.test.ts
- tests/unit/ImageCard.test.tsx
- tests/utils/supabase-mock.ts

**Verification**: `pnpm test` runs and passes

---

### You're Ready to Build!

After completing these steps, you'll have:
- ✅ Complete Next.js 15 project structure
- ✅ Supabase authentication with magic links
- ✅ Responsive gallery with lightbox
- ✅ Backblaze B2 image storage connected
- ✅ Keyword and semantic search working
- ✅ Share links for public sharing
- ✅ Admin keyword management
- ✅ Testing framework ready
- ✅ Docker development environment

**From here, you can:**
- Polish the UI and UX
- Run `test-orchestrator` to expand testing
- Run `deploy-guide` when ready to deploy to vps2
