# Deployment Strategy: Kline-Martin Photos

**Decision Date:** 2025-11-28
**Project Mode:** BALANCED
**Status:** Approved

---

## Primary Hosting Recommendation: Two-VPS Architecture

A distributed deployment using **vps2** for the application containers and **vps8 (Homelab)** for backend services. This separates the new app workload from existing infrastructure while leveraging Supabase (pgvector 0.8.0) and Ollama already running on Homelab.

### Why This Fits Your Project

- **Tech stack compatibility** - Docker handles Next.js, Python/FastAPI on dedicated app server
- **Traffic match** - Personal/family use with very low traffic; vps2's 8GB RAM is plenty
- **Budget alignment** - $0 marginal cost; both VPSes already paid for
- **Learning goals** - Teaches cross-VPS communication, direct PostgreSQL connections, distributed architecture
- **Isolation** - New app doesn't compete for resources with Homelab services

### Why This Fits Your Infrastructure

- **vps2 (App VPS)** - 2 cores, 8GB RAM, 100GB storage - dedicated to this app
- **vps8 (Homelab)** - Supabase with pgvector 0.8.0, Ollama with nomic-embed-text already running
- **Existing Caddy** on both VPSes - reverse proxy ready
- **Proven setup** - vps2 already hardened via vps-ready skill

---

## Hosting Details

| Aspect | Value |
|--------|-------|
| App Server | vps2 (srv993275.hstgr.cloud / 31.97.131.163) - 2 cores, 8GB RAM |
| Backend Server | vps8 (72.60.27.146) - 8 cores, 32GB RAM |
| Container Runtime | Docker + Docker Compose (on vps2) |
| Database | Supabase PostgreSQL on vps8 (pgvector 0.8.0) |
| Database Access | Direct PostgreSQL connection (port 5432) |
| File Storage | Backblaze B2 (S3-compatible) |
| CDN | Cloudflare (DNS) |
| SSL/TLS | Caddy on vps2 (automatic HTTPS) |
| Text Embeddings | Ollama on vps8 via HTTPS (`https://ollama.haugaard.dev`) |

---

## Architecture

```text
┌─────────────────────────────────────┐       ┌─────────────────────────────────────┐
│  vps2 (App VPS)                     │       │  vps8 (Homelab)                     │
│  srv993275.hstgr.cloud              │       │  72.60.27.146                       │
│  2 cores, 8GB RAM, 100GB            │       │  8 cores, 32GB RAM, 400GB           │
│                                     │       │                                     │
│  ┌──────────┐                       │       │  ┌─────────────────────────────┐   │
│  │  Caddy   │◄── photos.haugaard.dev│       │  │  Supabase (PostgreSQL)      │   │
│  │ (proxy)  │                       │       │  │  + pgvector 0.8.0           │   │
│  └────┬─────┘                       │       │  │  Port 5432                  │   │
│       │                             │       │  └──────────────▲──────────────┘   │
│       ├── / ────► Next.js (:3000)   │       │                 │                   │
│       │           [container]       │  TCP  │                 │                   │
│       │               │             │───────┼─────────────────┘                   │
│       │               │             │ :5432 │  (direct PostgreSQL)               │
│       └── /api/embed  │             │       │                                     │
│               │       │             │       │  ┌─────────────────────────────┐   │
│               ▼       │             │ HTTPS │  │  Caddy ──► Ollama           │   │
│  ┌────────────────┐   │             │───────┼─►│  ollama.haugaard.dev        │   │
│  │ Python Embed   │   │             │       │  │  (text embeddings)          │   │
│  │ SigLIP (:8001) │◄──┘             │       │  └─────────────────────────────┘   │
│  │ [container]    │                 │       │                                     │
│  └────────────────┘                 │       │                                     │
│                                     │       │                                     │
└─────────────────────────────────────┘       └─────────────────────────────────────┘
              │
              ▼
   ┌─────────────────┐
   │   Backblaze B2  │
   │ (image storage) │
   └─────────────────┘
```

---

## Cross-VPS Communication

### Database Access (PostgreSQL)

- **Method:** Direct TCP connection to vps8:5432
- **Requirement:** Firewall rule on vps8 allowing vps2's IP (31.97.131.163) to port 5432
- **Why direct:** pgvector similarity queries require raw PostgreSQL connection, not REST API

### Ollama Access (Text Embeddings)

- **Method:** HTTPS via existing `https://ollama.haugaard.dev`
- **Requirement:** None - already exposed via Caddy on vps8
- **Why HTTPS:** Simple HTTP requests for embedding, no complex queries

---

## Services Distribution

| Service | Location | Port | Memory | Purpose |
|---------|----------|------|--------|---------|
| Next.js | vps2 | 3000 | ~300-500 MB | Frontend + API routes |
| Python Embedding | vps2 | 8001 | ~1.5-2 GB | SigLIP image embeddings |
| Caddy | vps2 | 443/80 | ~50 MB | Reverse proxy + HTTPS |
| Supabase | vps8 | 5432 | Already allocated | PostgreSQL + Auth + pgvector |
| Ollama | vps8 | 11434 | Already allocated | Text embeddings (via HTTPS) |

**vps2 memory usage:** ~2-2.5 GB of 8 GB available
**vps2 headroom:** Comfortable (~5-6 GB free)

---

## Cost Breakdown

### Setup Costs

| Item | Cost |
|------|------|
| VPS | $0 (already paid) |
| Domain | $0 (already owned) |
| Cloudflare DNS | $0 (free tier) |
| **Total Setup** | **$0** |

### Monthly Ongoing

| Item | Cost |
|------|------|
| VPS (marginal) | $0 |
| Backblaze B2 (~5GB images) | ~$0.03 |
| Cloudflare | $0 |
| **Total Monthly** | **~$0.03** |

### Cost at Scale

| Traffic Level | Cost Change |
|---------------|-------------|
| Current (family use) | ~$0/month |
| 10x traffic | Still ~$0/month |
| 100x traffic | Still ~$0/month (VPS handles it) |

---

## Scaling Path

### Current State (Phase 0)

- Two-VPS deployment (app on vps2, backend on vps8)
- Clean separation between app workload and Homelab infrastructure
- Appropriate for personal/family use

### Phase 1: Optimization (if needed)

**Trigger:** Slow image embedding, page load times >3s

**Actions:**

- Add Redis on vps2 for caching frequently accessed images
- Optimize PostgreSQL indexes on vps8
- Consider pre-computing embeddings during off-peak hours

### Phase 2: Horizontal Scaling (unlikely needed)

**Trigger:** vps2 resource exhaustion (>80% sustained CPU/RAM)

**Actions:**

- Move embedding service to vps8 (co-locate with Ollama)
- Add CDN caching for static assets via Cloudflare
- Consider dedicated embedding VPS if needed

**Realistic expectation:** For a family photo app with ~1,100 images, you'll likely never need Phase 1 or 2.

---

## Alternative Hosting Option

### Alternative: Fly.io

**Architecture:** Same services deployed as Fly.io machines with managed Postgres

**Pros:**

- Zero server maintenance
- Built-in deployment CLI (`fly deploy`)
- Global distribution if needed
- Managed database backups

**Cons:**

- ~$25-40/month ongoing cost
- Duplicates infrastructure you already have
- Less learning about infrastructure layer
- Overkill for personal/family use

**Cost:** ~$30/month

**When to choose instead:**

- If VPS management becomes burdensome
- If you need global distribution
- If you prefer managed infrastructure over learning

---

## Backup Strategy

### Database Backups (on vps8)

| Aspect | Value |
|--------|-------|
| Frequency | Daily (automated via existing Homelab backup) |
| Method | pg_dump included in Supabase backup routine |
| Storage | Backblaze B2 (s3://haugaard-homelab-backups/) |
| Retention | 30 days on B2 (existing Homelab policy) |

The `kline_martin_photos` database is backed up as part of your existing Supabase backup routine on vps8.

### Image Backups

| Aspect | Value |
|--------|-------|
| Primary | Backblaze B2 (durable storage) |
| Secondary | Consider local copy of originals |
| Note | B2 has 11 nines durability; additional backup optional |

### Configuration Backups

- Docker Compose files: Version controlled in git
- Environment variables: Secure backup of .env file (encrypted)
- Caddy config on vps2: Include in git or backup separately

### Disaster Recovery Estimates

| Scenario | Location | Recovery Time |
|----------|----------|---------------|
| Container crash | vps2 | ~1 minute |
| Code rollback needed | vps2 | ~5 minutes |
| vps2 failure | vps2 | ~1-2 hours (new VPS via vps-ready + redeploy) |
| Database corruption | vps8 | ~30 minutes (restore from B2 backup) |
| vps8 failure | vps8 | ~2-4 hours (restore Homelab from B2) |

---

## Security Model

### vps2 (App VPS) - Hardened via vps-ready

- HTTPS via Caddy (automatic certificates)
- SSH key authentication
- Firewall limiting exposed ports (22, 80, 443)
- Fail2ban for SSH brute-force protection

### vps8 (Homelab)

- Supabase Row-Level Security for data access
- Magic link authentication (no passwords to steal)
- PostgreSQL only accessible from vps2's IP (firewall rule)
- All services behind Caddy reverse proxy

### Cross-VPS Security

- PostgreSQL connection uses IP whitelist (vps2 only)
- Ollama accessed via HTTPS (encrypted in transit)
- No sensitive credentials traverse public internet unencrypted

### Backblaze B2 Security

- Use application keys with minimal required permissions
- Enable bucket-level access restrictions
- Consider signed URLs for private image access

---

## Environment Configuration

These environment variables will be configured on **vps2** in the app's `.env` file:

| Variable | Source | Description |
|----------|--------|-------------|
| DATABASE_URL | vps8 Supabase .env | Direct PostgreSQL connection string |
| SUPABASE_URL | Known | `https://supabase.haugaard.dev` |
| SUPABASE_ANON_KEY | vps8 Supabase .env | Public API key |
| SUPABASE_SERVICE_KEY | vps8 Supabase .env | Service role key |
| B2_APPLICATION_KEY_ID | Backblaze dashboard | B2 access key |
| B2_APPLICATION_KEY | Backblaze dashboard | B2 secret key |
| B2_BUCKET_NAME | To be created | `kline-martin-photos` |
| B2_ENDPOINT | Known | `s3.us-west-004.backblazeb2.com` |
| OLLAMA_BASE_URL | Known | `https://ollama.haugaard.dev` |
| EMBEDDING_SERVICE_URL | Local | `http://localhost:8001` |
| NEXTAUTH_SECRET | Generate | `openssl rand -base64 32` |
| NEXTAUTH_URL | Known | `https://photos.haugaard.dev` |

**Note:** PostgreSQL password is in `/home/john/homelab/supabase/.env` on vps8 as `POSTGRES_PASSWORD`.

---

## Pre-Deployment Requirements

### Already Complete

- [x] pgvector 0.8.0 enabled in Supabase (verified)
- [x] Ollama has nomic-embed-text model installed
- [x] vps2 hardened via vps-ready skill

### Before Running deploy-guide

**On vps8:**

- [ ] Open firewall for vps2: `sudo ufw allow from 31.97.131.163 to any port 5432`
- [ ] Create `kline_martin_photos` database with pgvector extension

**DNS & Storage:**

- [ ] Add DNS record: `photos.haugaard.dev` → `31.97.131.163` (vps2 IP)
- [ ] Create Backblaze B2 bucket and application key

---

## Next Steps

**Handoff document:** .docs/deployment-strategy.md

1. Complete pre-deployment requirements above
2. Invoke **project-spinup** skill to generate project foundation
3. Build features
4. When ready to deploy → Use **deploy-guide** skill for step-by-step deployment
5. Optional → Use **ci-cd-implement** skill for automated deployments

---

## Workflow Status

```text
Phase 0: Project Brief ............ COMPLETE
Phase 1: Tech Stack ............... COMPLETE
Phase 2: Deployment Strategy ...... COMPLETE (this document)
Phase 3: Project Foundation ....... NEXT (project-spinup)
Phase 4: Test Strategy ............ Optional (test-orchestrator)
Phase 5: Deployment ............... Later (deploy-guide)
Phase 6: CI/CD .................... Optional (ci-cd-implement)
```
