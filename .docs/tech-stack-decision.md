# Tech Stack Decision: Kline-Martin Photos

**Decision Date:** 2025-11-28
**Project Mode:** BALANCED
**Status:** Approved

---

## Selected Stack: Next.js + Supabase + Python Embedding Microservice

### Summary

A full-stack JavaScript application using Next.js (App Router) for the frontend and API layer, Supabase (self-hosted) for PostgreSQL database with pgvector, authentication, and row-level security. A dedicated Python FastAPI microservice handles image embeddings using SigLIP, with Ollama providing text embeddings.

---

## Tech Stack Breakdown

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| **Frontend** | Next.js | 15.x (App Router) |
| **UI Framework** | React | 19.x |
| **Styling** | Tailwind CSS | 3.x |
| **Backend API** | Next.js API Routes | Server Actions where appropriate |
| **Embedding Service** | Python + FastAPI | 3.11+ / Uvicorn |
| **Database** | PostgreSQL (Supabase) | 15+ with pgvector |
| **Vector Search** | pgvector | Extension in Supabase |
| **Auth** | Supabase Auth | Magic link authentication |
| **Access Control** | Supabase RLS | Row-Level Security policies |
| **Image Storage** | Backblaze B2 | Existing infrastructure |
| **Image Embeddings** | SigLIP ViT-B/16 | ~86M params, 512-dim vectors |
| **Text Embeddings** | Ollama + nomic-embed-text | Existing infrastructure |
| **Reverse Proxy** | Caddy | Automatic HTTPS |
| **Deployment** | VPS (Docker) | 8 cores, 32 GB RAM |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         VPS                                 │
│  ┌─────────────┐    ┌─────────────────────────────────────┐│
│  │   Caddy     │───▶│         Next.js App                 ││
│  │(reverse     │    │  - Gallery UI (grid, lightbox)      ││
│  │ proxy)      │    │  - Search interface                 ││
│  └─────────────┘    │  - Admin keyword management         ││
│         │           │  - Share link pages                 ││
│         │           └──────────────┬──────────────────────┘│
│         │                          │                        │
│         ▼                          ▼                        │
│  ┌─────────────┐    ┌─────────────────────────────────────┐│
│  │ Python      │    │         Supabase                    ││
│  │ Embedding   │    │  - PostgreSQL + pgvector            ││
│  │ Service     │    │  - Auth (magic links)               ││
│  │ (FastAPI)   │    │  - Row-Level Security               ││
│  │ + SigLIP    │    └─────────────────────────────────────┘│
│  └─────────────┘                                            │
│         ▲                                                   │
│         │           ┌─────────────────────────────────────┐│
│         └───────────│         Ollama                      ││
│                     │  - nomic-embed-text                 ││
│                     └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Backblaze B2   │
│  (image files)  │
└─────────────────┘
```

---

## Key Design Decisions

### 1. pgvector over Marqo/FAISS

**Decision:** Use pgvector extension within Supabase PostgreSQL.

**Rationale:**
- Single data store for metadata, auth, and vectors
- No additional service to operate
- Native SQL integration for complex queries
- ~1,100 images is trivial scale for pgvector
- Already have Supabase running

### 2. SigLIP over OpenCLIP

**Decision:** Use SigLIP ViT-B/16 for image embeddings.

**Rationale:**
- Better zero-shot retrieval quality than CLIP
- 512-dim vectors (same as OpenCLIP B/32)
- Acceptable CPU performance (~1s per image)
- Well-supported in Hugging Face transformers

### 3. Standalone Embedding Service (Option A)

**Decision:** Deploy embedding service as separate FastAPI microservice.

**Rationale:**
- Decoupled from main app (can restart independently)
- Clear separation of concerns
- Easier to monitor and scale later
- Language-agnostic interface via HTTP

### 4. Next.js over alternatives

**Decision:** Use Next.js 15 with App Router.

**Rationale:**
- Industry-standard React patterns
- Server-side rendering for share links (SEO-friendly)
- API routes reduce need for separate backend
- Strong Supabase integration
- Matches learning goals

---

## Database Schema (Conceptual)

```sql
-- Images table with vectors
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  b2_path TEXT NOT NULL,
  title TEXT,
  keywords TEXT[],
  image_embedding vector(512),
  text_embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Share links
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
  role TEXT DEFAULT 'viewer', -- 'viewer' or 'admin'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index for similarity search
CREATE INDEX ON images USING ivfflat (image_embedding vector_cosine_ops);
CREATE INDEX ON images USING ivfflat (text_embedding vector_cosine_ops);
```

---

## Embedding Pipeline

### Indexing Flow (batch/offline)

1. Image discovered in B2 bucket
2. Fetch image → call Python embedding service → get 512-dim vector
3. Fetch metadata (title, keywords) → call Ollama → get 768-dim vector
4. Insert/update row in `images` table with both embeddings

### Query Flow (real-time)

1. User enters search query (e.g., "Christmas at the cabin")
2. Call Ollama to embed query → 768-dim text vector
3. Query pgvector: `ORDER BY text_embedding <=> query_vector LIMIT 20`
4. Return matching images to frontend

---

## Resource Allocation (VPS)

| Service | RAM | CPU | Notes |
|---------|-----|-----|-------|
| Next.js | ~500 MB | 1-2 cores | Node.js process |
| Python Embedding | ~2 GB | 2-4 cores | SigLIP model loaded |
| Supabase | ~4 GB | 2 cores | PostgreSQL + services |
| Ollama | ~1 GB | 1-2 cores | Already running |
| Caddy | ~50 MB | minimal | Reverse proxy |
| **Headroom** | ~24 GB | 2+ cores | Available for other services |

---

## Cost Analysis

| Item | Monthly Cost | Notes |
|------|--------------|-------|
| VPS | Already allocated | Shared infrastructure |
| Supabase | $0 | Self-hosted |
| Backblaze B2 | ~$1-5 | ~1,100 images + thumbnails |
| Domain/DNS | ~$1 | Cloudflare (existing) |
| **Total Marginal** | ~$2-6/month | |

---

## Alternatives Considered

### Alternative 1: Next.js + Supabase + Marqo

**Trade-offs:**
- Higher operational complexity (OpenSearch)
- More memory usage
- Hybrid search features may be overkill

**Ruled out because:** pgvector handles this scale; simpler is better.

### Alternative 2: FastAPI + HTMX (Python-only)

**Trade-offs:**
- Single language but less modern frontend
- Custom infinite scroll/lightbox implementation
- Less transferable React skills

**Ruled out because:** Learning goals include modern frontend; Next.js fits better.

### Alternative 3: PocketBase

**Ruled out because:** No vector search capability.

---

## Learning Outcomes

This stack will teach:

1. **Vector search fundamentals** via pgvector
2. **ML pipeline integration** connecting Python embeddings to a web app
3. **Modern React patterns** with Next.js App Router
4. **Authentication flows** with magic links
5. **Role-based access control** with RLS
6. **Microservices communication** between Node.js and Python

---

## Next Phase

Proceed to **deployment-advisor** to plan:
- Docker containerization strategy
- Caddy configuration
- Service orchestration (docker-compose)
- Backup and monitoring approach

---

## Handoff Checklist

- [x] Primary stack selected with rationale
- [x] Alternatives documented with trade-offs
- [x] Architecture diagram included
- [x] Database schema conceptualized
- [x] Resource requirements estimated
- [x] Cost analysis completed
- [x] Learning outcomes identified
