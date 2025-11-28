# Session Context: Kline-Martin Photos

## Current Status

**Phase:** Deployment Strategy (Phase 2) - COMPLETE
**Mode:** BALANCED

## What We've Done This Session

1. Invoked `deployment-advisor` skill
2. Evaluated hosting options: Cloudflare Pages, Fly.io, Hostinger VPS
3. Confirmed Cloudflare Pages insufficient (no container runtime for Python embedding service)
4. Compared Fly.io (~$30/month) vs VPS Docker ($0 marginal)
5. Selected **Two-VPS Architecture** as deployment target
6. Verified pgvector 0.8.0 is installed and enabled in self-hosted Supabase
7. Confirmed Ollama has nomic-embed-text model installed
8. Clarified two-VPS setup: vps2 (app) + vps8 (backend services)
9. Determined cross-VPS communication: direct PostgreSQL + HTTPS for Ollama
10. Created deployment strategy document
11. **Refined deployment strategy** - removed implementation details (belong in deploy-guide), kept strategy decisions only
12. **Renamed "Server 2" to "vps2"** for consistent naming across infrastructure

## Two-VPS Architecture

| VPS | Role | Specs | Services |
|-----|------|-------|----------|
| **vps2** | App VPS | 2 cores, 8GB RAM, 100GB | Next.js, Python Embedding, Caddy |
| **vps8** | Homelab | 8 cores, 32GB RAM, 400GB | Supabase, Ollama, existing infra |

### Cross-VPS Communication

- **PostgreSQL:** Direct TCP connection to vps8:5432 (firewall rule required)
- **Ollama:** HTTPS via `https://ollama.haugaard.dev` (already configured)

### Firewall Rule Required (on vps8)

```bash
sudo ufw allow from 31.97.131.163 to any port 5432 comment "vps2 PostgreSQL access"
```

## Deployment Decision Summary

| Aspect | Decision |
|--------|----------|
| App Server | vps2 (srv993275.hstgr.cloud / 31.97.131.163) |
| Backend Server | vps8 (72.60.27.146) |
| Containerization | Docker + Docker Compose (on vps2) |
| Database | Supabase PostgreSQL on vps8 (pgvector 0.8.0) |
| Database Access | Direct PostgreSQL (port 5432) |
| Text Embeddings | Ollama on vps8 via HTTPS |
| Reverse Proxy | Caddy on vps2 |
| Image Storage | Backblaze B2 |
| Monthly Cost | ~$0 (marginal) |

## Infrastructure Verification

- [x] pgvector 0.8.0 enabled in Supabase (vps8)
- [x] Ollama has nomic-embed-text model (vps8)
- [x] vps2 hardened via vps-ready skill
- [x] Caddy available on both VPSes
- [x] Backblaze B2 ready for image storage

## Tech Stack Summary (from Phase 1)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Backend API | Next.js API Routes |
| Embedding Service | Python + FastAPI + SigLIP ViT-B/16 |
| Database | PostgreSQL + pgvector |
| Auth | Supabase Auth (magic links) |
| Vector Search | pgvector (native PostgreSQL) |
| Text Embeddings | Ollama + nomic-embed-text |
| Image Storage | Backblaze B2 |

## Key Files

- [CLAUDE.md](../CLAUDE.md) - Project configuration
- [.docs/PROJECT-MODE.md](../.docs/PROJECT-MODE.md) - Workflow mode (BALANCED)
- [.docs/brief-kline-martin-photos.md](../.docs/brief-kline-martin-photos.md) - Project brief
- [.docs/tech-stack-decision-v2.md](../.docs/tech-stack-decision-v2.md) - Tech stack decision
- [.docs/deployment-strategy.md](../.docs/deployment-strategy.md) - Deployment strategy (strategy-focused, implementation in deploy-guide)
- [docs/image-embedding-stack.md](../docs/image-embedding-stack.md) - Embedding research
- [docs/image-semantic-search-pipeline.md](../docs/image-semantic-search-pipeline.md) - Pipeline spec

## Concepts Explained This Session

- **ML (Machine Learning):** Python libraries (PyTorch, transformers) for running trained models like SigLIP
- **Why Python for embeddings:** ML research community standardized on Python; best vision models released as Python packages
- **Shared vs. app-specific services:** Embedding service and database can be shared; Next.js apps are per-project

## Workflow Refinement Discussion

User identified overlap between deployment-strategy.md and deploy-guide skill:
- **deployment-advisor** should focus on strategy (decisions, architecture, rationale)
- **deploy-guide** should handle implementation (commands, configuration, verification)

Revised deployment-strategy.md to remove step-by-step commands, keeping only strategic decisions. This clarifies skill boundaries in the workflow.

## Next Steps

1. User confirms BALANCED mode checkpoint items
2. Invoke `project-spinup` skill to generate project foundation
3. Build features
4. When ready: Invoke `deploy-guide` skill for deployment
5. Optional: Invoke `ci-cd-implement` for automation

## Workflow Progress

```text
[x] Phase 0: Project Brief (project-brief-writer)
[x] Phase 1: Tech Stack Advisor (complete)
[x] Phase 2: Deployment Strategy (CURRENT - complete)
[ ] Phase 3: Project Foundation (project-spinup) <- NEXT
[ ] Phase 4: Test Strategy (test-orchestrator) - optional
[ ] Phase 5: Deployment (deploy-guide)
[ ] Phase 6: CI/CD (ci-cd-implement) - optional
```
