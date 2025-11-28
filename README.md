# Kline-Martin Photos

A private family photo gallery with semantic search capabilities. Browse, search, and share ~1,100 curated family images using natural language queries like "Christmas at the cabin" or "beach vacation."

## Features

- **Semantic Search** - Find photos using natural language, not just keywords
- **Keyword Search** - Traditional metadata-based search
- **Responsive Gallery** - Clean grid layout with lightbox viewing
- **Share Links** - Generate public links to individual photos
- **Magic Link Auth** - Passwordless authentication for family members
- **Admin Tools** - Keyword management for designated admins

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Database**: PostgreSQL with pgvector (via Supabase)
- **Auth**: Supabase Auth (magic links)
- **Storage**: Backblaze B2
- **Embeddings**: SigLIP (images), Ollama/nomic-embed-text (text)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm)
- Docker Desktop
- Python 3.11+ (for embedding service)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd kline-martin-photos
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start Docker services**

   ```bash
   docker compose up -d
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

## Development

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
pnpm test         # Run tests
```

### Docker Services

```bash
docker compose up -d       # Start services
docker compose down        # Stop services
docker compose logs -f     # View logs
docker compose up --build  # Rebuild containers
```

## Project Structure

```
kline-martin-photos/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and clients
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── embedding-service/    # Python FastAPI service
├── tests/                # Test files
├── docs/                 # Documentation
└── .docs/                # Workflow handoff documents
```

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Comprehensive project context and guided setup steps
- [Project Brief](.docs/brief-kline-martin-photos.md)
- [Tech Stack Decision](.docs/tech-stack-decision-v2.md)
- [Deployment Strategy](.docs/deployment-strategy.md)

## Deployment

This app deploys to a two-VPS architecture:

- **vps2**: Next.js app + embedding service
- **vps8**: Supabase (PostgreSQL + pgvector) + Ollama

See [CLAUDE.md](./CLAUDE.md) for deployment details.

## License

Private project - All rights reserved.
