# Session Context: Kline-Martin Photos

## Current Status
**Phase:** Project Brief (Phase 0) - COMPLETE, awaiting user review
**Mode:** BALANCED

## What We've Done
1. Created project structure (`.claude/` directory, session files)
2. Created `CLAUDE.md` with project configuration
3. Set workflow mode to BALANCED in `.docs/PROJECT-MODE.md`
4. Generated comprehensive project brief in `.docs/brief-kline-martin-photos.md`

## Project Summary
- **Purpose:** Private family photo gallery for ~20 users
- **Content:** ~1,100 images from family archive
- **Key Features:**
  - Keyword + semantic search (using image embeddings)
  - Responsive grid with infinite scroll
  - Lightbox image viewing
  - Full-resolution download
  - Shareable links (public-safe, no metadata)
  - Magic link authentication
  - Admin keyword management

## User Research Already Done
Two detailed research documents exist in `docs/`:
- `image-embedding-stack.md` - CPU-first architecture with Ollama + OpenCLIP/SigLIP
- `image-semantic-search-pipeline.md` - Full pipeline spec including Marqo/FAISS options

## Current Assets
- 10 prototype images + JSON metadata files in Backblaze B2 bucket
- Full ~1,100 images will be in a separate bucket

## Out of Scope (V1)
- Uploading new photos
- Commenting
- Albums/folders
- Bulk operations

## Next Steps
1. User reviews brief
2. Invoke `tech-stack-advisor` skill
3. Invoke `deployment-advisor` skill
4. Invoke `project-spinup` skill

## Key Files
- [CLAUDE.md](../CLAUDE.md) - Project configuration
- [.docs/PROJECT-MODE.md](../.docs/PROJECT-MODE.md) - Workflow mode declaration
- [.docs/brief-kline-martin-photos.md](../.docs/brief-kline-martin-photos.md) - Project brief
- [docs/image-embedding-stack.md](../docs/image-embedding-stack.md) - Embedding research
- [docs/image-semantic-search-pipeline.md](../docs/image-semantic-search-pipeline.md) - Pipeline spec
