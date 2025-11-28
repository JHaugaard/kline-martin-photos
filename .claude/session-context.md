# Session Context: Kline-Martin Photos

## Current Status

**Phase:** Project Foundation (Phase 3) - COMPLETE
**Mode:** BALANCED
**Next:** Step 1 of Guided Setup (Next.js initialization)

## What We've Done This Session

### Phase 3: Project Spinup (COMPLETE)

1. Invoked `project-spinup` skill with Guided Setup approach
2. Created comprehensive CLAUDE.md with 12-step guided setup
3. Created docker-compose.yml for local development (PostgreSQL + embedding service)
4. Set up directory structure: src/, tests/, embedding-service/
5. Created .env.example with all required environment variables
6. Created .gitignore for Next.js + Python
7. Updated README.md with project overview
8. Created scripts/init-db.sql for database initialization with pgvector
9. Created .docs/project-foundation-complete.md handoff marker

### Updates Made

1. **Production domain:** Changed from `photos.haugaard.dev` to `kline-martin-photos.com`
2. **Local sample data:** Documented 10 test images in `kline-martin-photos/` subdirectory
3. **Git workflow:** Simplified to work on `main` during V0.1, branch later
4. **Date sorting:** Noted as not meaningful (scanned images share similar dates)

### Sample Data Available

10 JPEGs + JSON metadata files in `kline-martin-photos/` subdirectory:
- Rich metadata: keywords, dates, dimensions, SmugMug origins
- Example keywords: `["Martin", "Portrait", "Jack"]`
- Enables offline development without B2 API calls

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
| CLAUDE.md | Comprehensive project context + 12-step guided setup |
| docker-compose.yml | PostgreSQL + embedding service for local dev |
| .env.example | Environment variable template |
| .gitignore | Next.js + Python ignore patterns |
| README.md | Project overview |
| scripts/init-db.sql | Database schema with pgvector |
| .docs/project-foundation-complete.md | Handoff marker |

## 12-Step Guided Setup (Ready to Start)

1. **Initialize Next.js Structure** ← NEXT
2. Configure Supabase Client
3. Implement Magic Link Authentication
4. Build Gallery Grid Component
5. Add Lightbox Viewer
6. Connect Backblaze B2 Storage
7. Implement Search Foundation
8. Set Up Python Embedding Service
9. Add Semantic Search
10. Implement Share Links
11. Add Admin Keyword Management
12. Testing Setup

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
- [.docs/project-foundation-complete.md](../.docs/project-foundation-complete.md) - Phase 3 handoff

## Workflow Progress

```text
[x] Phase 0: Project Brief (project-brief-writer)
[x] Phase 1: Tech Stack Advisor (complete)
[x] Phase 2: Deployment Strategy (complete)
[x] Phase 3: Project Foundation (project-spinup) - COMPLETE
[ ] Step 1-12: Guided Setup <- READY TO START
[ ] Phase 4: Test Strategy (test-orchestrator) - optional
[ ] Phase 5: Deployment (deploy-guide)
[ ] Phase 6: CI/CD (ci-cd-implement) - optional
```

## Next Action

User says: **"Let's start Step 1"** to initialize Next.js structure
