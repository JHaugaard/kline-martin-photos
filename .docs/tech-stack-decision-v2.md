# Tech Stack Decision: Kline-Martin Photos

**Decision Date:** 2025-11-28
**Project Mode:** BALANCED
**Status:** Approved

---

## Selected Stack: Next.js + Supabase + Python Embedding Service

### Summary

A full-stack JavaScript application using Next.js (App Router) for the frontend and API layer, Supabase for PostgreSQL database with pgvector, authentication, and row-level security. A dedicated Python service handles image embeddings using SigLIP, with Ollama providing text embeddings.

---

## Tech Stack Breakdown

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| **Frontend** | Next.js | 15.x (App Router) |
| **UI Framework** | React | 19.x |
| **Styling** | Tailwind CSS | 3.x |
| **Backend API** | Next.js API Routes | Server Actions where appropriate |
| **Embedding Service** | Python + FastAPI | 3.11+ |
| **Database** | PostgreSQL | 15+ with pgvector extension |
| **Vector Search** | pgvector | Native PostgreSQL extension |
| **Auth** | Supabase Auth | Magic link authentication |
| **Access Control** | Row-Level Security | PostgreSQL RLS policies |
| **Image Storage** | Backblaze B2 | S3-compatible object storage |
| **Image Embeddings** | SigLIP ViT-B/16 | ~86M params, 512-dim vectors |
| **Text Embeddings** | Ollama + nomic-embed-text | 768-dim vectors |

---

## Key Technology Decisions

### 1. pgvector for Vector Search

**Decision:** Use pgvector extension within PostgreSQL.

**Rationale:**
- Single data store for metadata, auth, and vectors
- Native SQL integration for complex queries
- ~1,100 images is well within pgvector's comfortable range
- Eliminates need for separate vector database (Marqo, Milvus, etc.)

**Trade-off accepted:** Less sophisticated hybrid search than Marqo, but sufficient for this use case.

### 2. SigLIP for Image Embeddings

**Decision:** Use SigLIP ViT-B/16 for image embeddings.

**Rationale:**
- Superior zero-shot retrieval quality compared to OpenCLIP
- 512-dimensional vectors (storage-efficient)
- Optimized for contrastive search tasks
- Well-supported in Hugging Face transformers library

**Trade-off accepted:** Slightly slower than OpenCLIP ViT-B/32 on CPU, but better retrieval quality.

### 3. Separate Embedding Service

**Decision:** Implement image embedding as a standalone HTTP service rather than embedded in the main application.

**Rationale:**
- Decoupled lifecycle (can restart/update independently)
- Language-agnostic interface (Next.js calls via HTTP)
- Clear separation between web application and ML inference
- Easier to monitor, profile, and optimize

**Trade-off accepted:** Network overhead for IPC, but negligible for this workload.

### 4. Next.js with App Router

**Decision:** Use Next.js 15 for the web application.

**Rationale:**
- Server-side rendering for share link pages (public, SEO-friendly)
- API routes reduce need for separate backend service
- Strong ecosystem and Supabase integration
- Modern React patterns (Server Components, Suspense)
- Matches stated learning goals

**Trade-off accepted:** Requires JavaScript/TypeScript alongside Python (two languages).

### 5. Supabase for Auth + Database

**Decision:** Use Supabase as the primary backend service.

**Rationale:**
- Magic link authentication built-in (core requirement)
- PostgreSQL with pgvector support
- Row-Level Security for admin vs. viewer permissions
- Unified platform reduces integration complexity

**Trade-off accepted:** Dependency on Supabase's auth patterns.

---

## Database Schema (Conceptual)

```sql
-- Images table with vectors
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  keywords TEXT[],
  image_embedding vector(512),
  text_embedding vector(768),
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
  role TEXT DEFAULT 'viewer', -- 'viewer' or 'admin'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vector similarity indexes
CREATE INDEX ON images USING ivfflat (image_embedding vector_cosine_ops);
CREATE INDEX ON images USING ivfflat (text_embedding vector_cosine_ops);
```

---

## Embedding Pipeline (Logical Flow)

### Indexing Flow

1. Image file exists in storage
2. Fetch image → call embedding service → receive 512-dim image vector
3. Fetch metadata (title, keywords) → call Ollama → receive 768-dim text vector
4. Store both vectors with metadata in `images` table

### Query Flow

1. User enters search query (e.g., "Christmas at the cabin")
2. Embed query text via Ollama → 768-dim vector
3. Query database: `ORDER BY text_embedding <=> query_vector LIMIT N`
4. Return matching image records to frontend

---

## Service Dependencies

```
┌─────────────────┐
│   Next.js App   │
│  (frontend +    │
│   API routes)   │
└────────┬────────┘
         │
    ┌────┴────┬─────────────┐
    ▼         ▼             ▼
┌───────┐ ┌───────┐ ┌──────────────┐
│Supabase│ │Ollama │ │  Embedding   │
│(PG +   │ │(text  │ │   Service    │
│ Auth)  │ │ embed)│ │  (SigLIP)    │
└───────┘ └───────┘ └──────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Backblaze   │
                    │     B2      │
                    └─────────────┘
```

*Note: This diagram shows logical service dependencies only. Physical deployment topology (containers, hosts, networking) is determined by deployment-advisor.*

---

## Resource Characteristics

These estimates inform deployment planning but do not prescribe deployment approach:

| Service | Memory Footprint | CPU Characteristics | Notes |
|---------|------------------|---------------------|-------|
| Next.js | ~300-500 MB | Low, burst on requests | Node.js runtime |
| Python Embedding | ~1.5-2 GB | CPU-intensive during inference | Model weights in memory |
| PostgreSQL | ~1-4 GB | Moderate, scales with queries | Depends on configuration |
| Ollama | ~500 MB - 1 GB | CPU burst for embeddings | Model-dependent |

**Total estimated memory:** 4-8 GB active, depending on concurrency and configuration.

---

## Alternatives Considered

### Alternative 1: Next.js + Supabase + Marqo

Use Marqo as a dedicated vector search layer instead of pgvector.

**Advantages:**
- Higher-level multimodal search API
- Built-in hybrid keyword + vector search
- Potentially faster prototyping of search features

**Trade-offs:**
- Requires OpenSearch (significant memory overhead)
- Additional service to operate and maintain
- Duplicates storage (vectors in both Marqo and potentially PostgreSQL)
- Overkill for ~1,100 images

**Verdict:** Not recommended for this scale. pgvector is sufficient and simpler.

### Alternative 2: FastAPI + HTMX (Python-only)

Full Python stack with server-rendered templates and HTMX for interactivity.

**Advantages:**
- Single language for entire application
- Direct integration with embedding libraries (no HTTP boundary)
- Simpler mental model

**Trade-offs:**
- Less modern frontend experience
- Custom implementation needed for infinite scroll, lightbox
- Smaller ecosystem for frontend components
- Less transferable to industry-standard React patterns

**Verdict:** Viable, but doesn't align with stated learning goals around modern frontend development.

### Alternative 3: PocketBase

Use PocketBase instead of Supabase for simpler auth and data storage.

**Advantages:**
- Single binary, minimal operational overhead
- Built-in auth with magic links
- Simpler than Supabase for basic CRUD

**Trade-offs:**
- SQLite backend has no vector search capability
- Would require separate vector database anyway
- Less feature-rich than PostgreSQL

**Verdict:** Ruled out due to lack of vector search support.

---

## Learning Outcomes

This stack teaches:

1. **Vector search fundamentals** - pgvector operations, similarity metrics, indexing strategies
2. **ML pipeline integration** - connecting embedding models to a production web application
3. **Modern React patterns** - Server Components, App Router, Suspense boundaries
4. **Authentication flows** - magic link implementation and session management
5. **Role-based access control** - PostgreSQL RLS policies
6. **Service integration** - coordinating multiple services via HTTP APIs

---

## Information for Deployment Advisor

The following context may inform deployment decisions:

**Available infrastructure (from user profile):**
- Hostinger VPS: 8 cores, 32 GB RAM, 400 GB storage
- Supabase (self-hosted): Already running
- Ollama: Already running
- Caddy: Available for reverse proxy
- n8n: Available for workflow automation

**Services requiring deployment:**
1. Next.js application (Node.js)
2. Python embedding service (FastAPI + SigLIP model)
3. PostgreSQL with pgvector (or use existing Supabase)

**Deployment questions for deployment-advisor to address:**
- Containerized vs. native deployment?
- Reverse proxy configuration?
- Service orchestration approach?
- Use existing self-hosted Supabase or separate PostgreSQL?
- How to handle embedding service lifecycle?
- Backup and monitoring strategy?

---

## Handoff Checklist

- [x] Primary stack selected with rationale
- [x] Key technology decisions documented with trade-offs
- [x] Alternatives analyzed and ruled out with reasons
- [x] Database schema conceptualized
- [x] Service dependencies mapped (logical, not physical)
- [x] Resource characteristics estimated (not deployment-prescribed)
- [x] Learning outcomes identified
- [x] Context provided for deployment-advisor without prescribing solutions
