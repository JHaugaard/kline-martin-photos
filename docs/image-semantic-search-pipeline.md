# Image Semantic Search Pipeline: Specification Document

## Executive Summary

This specification outlines a CPU-friendly image semantic search system designed for a VPS environment (8 cores, 32 GB RAM, 400 GB shared storage). The architecture combines OpenCLIP/SigLIP image encoders with text embeddings (via Ollama's `nomic-embed-text`) to enable multimodal semantic queries over JPEG collections.

**Example queries:**
- "Find all images that include Pat, Jack, and an automobile"
- "Christmas"
- "beach sunset with people"

---

## System Architecture

### High-Level Flow

```
JPEGs (S3-compatible storage)
    â†“
Image Embedding Service (CLIP/SigLIP encoder)
    â†“
Image Embeddings (512â€“768-dim vectors)
    â†“
Vector Index + Metadata Store
    â†“
Search API (text query â†’ embeddings â†’ nearest-neighbor retrieval)
```

### Component Stack

| Layer              | Purpose                        | Technology                            |
| ------------------ | ------------------------------ | ------------------------------------- |
| **Image storage**  | JPEG persistence               | S3-compatible (Backblaze B2, etc.)    |
| **Image encoding** | JPEG â†’ dense vector          | OpenCLIP or SigLIP (ViT-B)            |
| **Text encoding**  | Captions/tags â†’ dense vector | Ollama + `nomic-embed-text`           |
| **Vector index**   | Store & retrieve embeddings    | Marqo, FAISS, or vector DB (flexible) |
| **Query layer**    | Accept queries, return results | Application-level (backend)           |

---

## Core Component: Image Embedding Service

### Overview

The image embedding service converts JPEGs into fixed-size dense vectors using a CLIP or SigLIP vision encoder. This service is the critical bridge between your JPEG storage and semantic search backend.

### Deployment Options

#### Option A: Standalone HTTP Microservice

**Architecture:**
- Runs as a separate process on the VPS (or in a container).
- Exposes REST endpoints for image embedding.
- Decoupled from your main application logic.

**Advantages:**
- Language/framework agnostic: your main app can be Python, Node, Go, etc.
- Easy to scale or offload to a separate machine later.
- Clear separation of concerns.
- Simple to monitor and restart independently.

**Disadvantages:**
- Network overhead (IPC between app and service).
- Requires HTTP server management (FastAPI, Flask, etc.).
- Additional operational complexity.

**Recommended stack:**
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Model library:** `transformers` (for SigLIP) or `open_clip_torch` (for OpenCLIP)
- **Image processing:** Pillow

**Example endpoints:**

```
POST /embed-image
Content-Type: application/json
Body: {
  "image_path": "s3://bucket/path/to/image.jpg"
}
Response: {
  "embedding": [0.0123, -0.456, 0.789, ...],
  "model": "SigLIP-ViT-B-16",
  "dimension": 512
}

POST /embed-batch
Body: {
  "image_paths": ["s3://bucket/img1.jpg", "s3://bucket/img2.jpg"]
}
Response: {
  "embeddings": [[...], [...]]
}
```

**Resource footprint:**
- Memory: ~1â€“2 GB for model + inference overhead.
- CPU: Can batch 8â€“32 images per request depending on throughput tolerance.
- Latency: On CPU, expect ~500msâ€“2s per image for ViT-B models (acceptable for batch indexing).

---

#### Option B: Embedded Library in Main Backend

**Architecture:**
- Image encoding logic lives in your main application codebase.
- Loaded once at app startup.
- Called directly from within your indexing/search workflows.

**Advantages:**
- No IPC or HTTP overhead.
- Simpler deployment (one process, one language).
- Direct memory sharing for batch operations.
- Easier debugging within your app context.

**Disadvantages:**
- Tightly couples your app to the encoder model (deployment, updates).
- Slower to iterate if you want to swap models or add new services.
- Requires the main app framework to support Python (if using Python) or equivalent FFI.

**Recommended stack:**
- **Language:** Python (best integration with PyTorch / transformers)
- **Pattern:** Lazy-load model at startup, expose as a module or class.
- **Dependencies:** Same as Option A, but imported directly.

**Pseudocode pattern:**

```python
class ImageEmbeddingEngine:
    def __init__(self, model_name="ViT-B-16-SigLIP"):
        self.processor = AutoProcessor.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()  # inference mode
    
    def embed_image(self, image_path):
        """Load image from S3 or local FS, return embedding."""
        image = load_image(image_path)
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model.get_image_features(**inputs)
        return outputs.numpy().flatten()
    
    def embed_batch(self, image_paths):
        """Embed multiple images, return list of embeddings."""
        return [self.embed_image(p) for p in image_paths]

# In your app:
encoder = ImageEmbeddingEngine()
emb = encoder.embed_image("s3://bucket/image.jpg")
```

---

### Model Selection

#### Recommended: SigLIP ViT-B/16 (Base)

**Identifier:** `google/siglip-base-patch16-512` (Hugging Face)

**Characteristics:**
- **Parameters:** ~86M
- **Embedding dimension:** 512
- **Model size (disk):** ~350 MB
- **Performance:** Strong zero-shot retrieval quality; outperforms OpenAI CLIP B/32 on many benchmarks.
- **Inference speed (CPU):** ~800msâ€“1.5s per image with batching.

**Why this choice:**
- Excellent balance of quality, size, and CPU performance.
- Built specifically for retrieval (SigLIP uses a different loss function than CLIP, optimized for contrastive search).
- Well-supported in `transformers` library.

**Reference:**
- [SigLIP on Hugging Face](https://huggingface.co/google/siglip-base-patch16-512)
- [SigLIP paper](https://arxiv.org/abs/2403.19507)

#### Alternative: OpenCLIP ViT-B/32

**Identifier:** OpenCLIP model card (e.g., via `timm` or `open_clip`)

**Characteristics:**
- **Parameters:** ~86M
- **Embedding dimension:** 512
- **Model size:** ~350 MB
- **Performance:** Solid, widely-used baseline; slightly lower quality than SigLIP B/16 but faster.
- **Inference speed (CPU):** ~500â€“800ms per image.

**Why consider this:**
- If SigLIP proves too slow on your CPU, OpenCLIP B/32 is a proven fallback.
- Extensive tutorial coverage and community examples.

**Reference:**
- [OpenCLIP GitHub](https://github.com/mlfoundations/open_clip)

#### Do NOT use for this project:
- Large variants (L/14, H, g): too slow on CPU.
- Domain-specific models (FashionCLIP, etc.): not general-purpose.
- Older CLIP variants (ViT-B/16 or ViT-L from OpenAI, which are now behind API).

---

## Integration with Text Embeddings

### Role of Ollama + nomic-embed-text

For queries like **"Christmas"** or **"Pat, Jack, and automobile,"** you'll need text embeddings for matching against image captions/tags/metadata.

**Setup:**
- Ollama is already running on your VPS with `nomic-embed-text` loaded.
- When you index an image, you also embed its associated text (title, description, tags).

**Example indexing workflow:**

```
1. New image uploaded: "photo_123.jpg"
2. Fetch image metadata: title="Christmas Party 2024", tags=["Christmas", "family", "indoors"]
3. Call image encoder â†’ get image_embedding (512-dim)
4. Call Ollama embed â†’ get text_embedding (768-dim)
5. Write to vector index:
   {
     "image_id": "photo_123",
     "image_embedding": [...],
     "text_embedding": [...],
     "metadata": { "title": "...", "tags": [...], "s3_path": "..." }
   }
```

**Query example:**

```
User query: "Christmas"
â†’ Embed query with nomic-embed-text â†’ get text_embedding (768-dim)
â†’ Search vector index for nearest neighbors in text_embedding space
â†’ Return images with matching captions/tags

User query: "Find images with people playing volleyball on a beach"
â†’ (Could embed with image query; or encode description and search text_embedding space)
```

---

## Vector Index Integration (Flexible)

### Interface Requirements

Your image embeddings must land in a vector index that supports:

1. **Storing high-dimensional vectors** (512â€“768-dim float32).
2. **Approximate nearest-neighbor (ANN) search** (cosine or dot-product similarity).
3. **Metadata storage** (image paths, titles, timestamps, etc.).
4. **Batch insert/upsert** for efficient indexing.

### Option 1: Marqo (Recommended for ease of use)

**Setup:**
- Marqo runs as a Docker container or standalone service over OpenSearch.
- You send documents (embeddings + metadata) to Marqo's HTTP API.
- Marqo stores them in OpenSearch and exposes search endpoints.

**Integration pattern:**

```python
import marqo

mq = marqo.Client(url="http://localhost:8882")

# Create index
mq.create_index("image-search")

# Add documents with pre-computed embeddings
mq.index("image-search").add_documents([
    {
        "id": "photo_123",
        "image_embedding": [0.123, -0.456, ...],  # From SigLIP encoder
        "text_embedding": [0.789, ...],            # From Ollama
        "title": "Christmas Party",
        "s3_path": "s3://bucket/photo_123.jpg"
    }
], device="cpu")

# Search
results = mq.index("image-search").search(
    q="Christmas",
    limit=10
)
```

**Pros:**
- High-level API; no need to manage ANN index details.
- Hybrid keyword + vector search out of the box.
- Built for multimodal (text + images).

**Cons:**
- Requires OpenSearch (adds operational complexity).
- Marqo primarily focuses on text embeddings; image-specific workflows need custom handling.

---

### Option 2: FAISS (Lightweight, embedded)

**Setup:**
- FAISS is a Python library; you build and manage indices programmatically.
- Stores indices on disk or in memory.
- No separate service required.

**Integration pattern:**

```python
import faiss
import numpy as np

# Create index (IVF1024 for moderate scale; Flat for small scale)
index = faiss.IndexFlatL2(512)  # 512-dim vectors, L2 distance

# Add embeddings
embeddings_array = np.array([...], dtype=np.float32)  # (N, 512)
index.add(embeddings_array)

# Store metadata separately
metadata = {
    0: {"title": "Christmas Party", "s3_path": "s3://..."},
    1: {"title": "...", "s3_path": "..."},
}

# Save index to disk
faiss.write_index(index, "image_index.faiss")

# Search
query_embedding = np.array([...], dtype=np.float32)  # (1, 512)
distances, indices = index.search(query_embedding, k=10)
results = [metadata[i] for i in indices[0]]
```

**Pros:**
- Minimal dependencies; pure Python + NumPy + FAISS.
- Fast and memory-efficient.
- Easy to deploy without extra services.

**Cons:**
- Manual metadata management (no built-in DB).
- No built-in support for dynamic updates (rebuild required for large changes).
- Text search requires separate logic (you'd need to embed text queries separately).

---

### Option 3: Vector Databases (Weaviate, Milvus, Pinecone)

For larger deployments or if you need more sophisticated features, consider:

- **Weaviate**: Open-source, cloud-native, supports multimodal search.
- **Milvus**: Dedicated vector DB, strong ANN performance, good for scale.
- **Pinecone**: Managed service (cloud).

For your current scope (light/moderate use, single VPS), Marqo or FAISS are sufficient.

---

## Implementation Phases

### Phase 1: Baseline (SigLIP + Standalone Service)

**Goals:**
- Prove the image encoding service works.
- Index a small test set of JPEGs.
- Implement basic search.

**Scope:**
1. Stand up Option A (FastAPI microservice) with SigLIP ViT-B/16.
2. Implement `/embed-image` and `/embed-batch` endpoints.
3. Create a simple indexing script:
   - Read JPEGs from S3.
   - Call the embedding service.
   - Write embeddings + metadata to FAISS or Marqo.
4. Build a search CLI or simple UI to test queries.

**Success criteria:**
- Embed 100 test images in under 5 minutes.
- Return top-5 results for a text query in <500ms.
- No crashes; logging works.

---

### Phase 2: Integration (Ollama + Text Embeddings)

**Goals:**
- Link text queries to Ollama embeddings.
- Support hybrid search (text query â†’ text embedding + optional image re-ranking).

**Scope:**
1. Build indexing pipeline that calls both:
   - Image encoder (SigLIP) for JPEG.
   - Ollama's `nomic-embed-text` for title/description/tags.
2. Update vector index schema to store both embeddings + metadata.
3. Implement search that dispatches queries to appropriate encoder.

**Success criteria:**
- Query "Christmas" returns relevant images.
- Query "Pat, Jack, and automobile" works reliably.

---

### Phase 3: Optimization & Scaling (Optional)

**Scope:**
- Consider embedded option (Option B) if standalone service proves inefficient.
- Add worker queue for batch indexing (e.g., n8n workflow, Celery).
- Profile and tune FAISS index type or Marqo settings for latency/recall tradeoff.
- Consider OpenCLIP ViT-B/32 as fallback if SigLIP is too slow.

---

## Resource Requirements

### CPU & Memory (VPS: 8 cores, 32 GB RAM)

| Component                 | RAM       | CPU                    | Notes             |
| ------------------------- | --------- | ---------------------- | ----------------- |
| SigLIP ViT-B/16 model     | ~1.5 GB   | 2â€“4 cores (batching) | Runs inference    |
| Image batch (16 images)   | ~0.5 GB   | â€”                    | Temporary buffers |
| FAISS index (100k images) | ~200 MB   | â€”                    | Negligible        |
| Marqo + OpenSearch        | ~2â€“4 GB | 2 cores                | If using Marqo    |
| Ollama + nomic-embed-text | ~0.5 GB   | 1â€“2 cores            | Already running   |
| Headroom for app          | ~10 GB    | â€”                    | Main application  |

**Total headroom:** 32 GB is ample for this workload.

### Storage

| Item                        | Size                             | Notes                   |
| --------------------------- | -------------------------------- | ----------------------- |
| SigLIP model                | 350 MB                           | Downloaded once         |
| nomic-embed-text (Ollama)   | 400 MB                           | Already present         |
| Index data (100k images)    | ~200 MB (FAISS) or ~2 GB (Marqo) | Scales with corpus      |
| Embeddings cache (optional) | Variable                         | Offload to S3 if needed |

**Total headroom:** 400 GB shared storage is more than sufficient.

### Network

- **Image download:** Batching amortizes S3 latency; expect ~10â€“20 images/min from S3 on typical VPS bandwidth.
- **Inference:** Entirely local; no network overhead for actual embedding computation.

---

## Batch Processing Pattern (Recommended)

For indexing, a **batch/queue pattern** is recommended to decouple ingestion from search availability.

### Simple Pattern: Async Task Queue

```python
# Worker process or script
from image_embedding_service import ImageEmbeddingEngine
from vector_index import VectorIndexClient

encoder = ImageEmbeddingEngine()
index = VectorIndexClient(url="http://localhost:8882")  # or FAISS

while True:
    # Poll for pending images (e.g., from a DB or queue)
    pending = get_pending_images(limit=32)
    
    if not pending:
        time.sleep(5)
        continue
    
    # Embed batch
    embeddings = encoder.embed_batch([img.s3_path for img in pending])
    
    # Index
    for img, emb in zip(pending, embeddings):
        text_emb = call_ollama_embed(img.title + " " + " ".join(img.tags))
        index.add_document({
            "id": img.id,
            "image_embedding": emb,
            "text_embedding": text_emb,
            "metadata": {...}
        })
    
    # Mark as indexed
    mark_indexed(pending)
```

### Alternative: n8n Workflow (if using existing n8n homelab)

- **Trigger:** Webhook when image lands in S3.
- **Steps:**
  1. Fetch image from S3.
  2. Call embedding service.
  3. Call Ollama for text embedding.
  4. Write to vector index.
  5. Mark as indexed in DB.

---

## Query Examples

### Example 1: Text Query
```
User input: "Christmas"
Process:
  1. Embed "Christmas" with nomic-embed-text â†’ text_embedding
  2. Search vector index for nearest neighbors in text_embedding space
  3. Return top-K images sorted by similarity
Result:
  [
    {"id": "photo_123", "title": "Christmas Party", "similarity": 0.92},
    {"id": "photo_456", "title": "Xmas Decorations", "similarity": 0.88},
    ...
  ]
```

### Example 2: Multi-term Query
```
User input: "Pat, Jack, and automobile"
Process:
  1. Embed full string with nomic-embed-text
  2. Search text embedding space
  3. (Optional) Re-rank by image similarity if available
Result:
  [
    {"id": "photo_789", "title": "Pat and Jack's Road Trip", "similarity": 0.87},
    ...
  ]
```

### Example 3: Image Query (Advanced)
```
User uploads image: query_image.jpg
Process:
  1. Embed query_image with SigLIP â†’ query_image_embedding
  2. Search vector index for nearest neighbors in image_embedding space
  3. Return visually similar images
Result:
  [
    {"id": "photo_111", "title": "Similar beach photo", "similarity": 0.85},
    ...
  ]
```

---

## Security & Operations

### S3 Credentials

- Store S3 credentials in environment variables or secrets manager.
- Use IAM roles if running on AWS EC2 / compatible.
- Ensure service has read-only access to image bucket.

### API Exposure

- Embed the image embedding service behind a reverse proxy (e.g., Caddy) with auth if exposed externally.
- Restrict to internal network if possible.

### Monitoring

- Log all embedding requests (timestamp, image path, embedding dimension, latency).
- Track index size and query latency over time.
- Set alerts for service crashes or high latency.

---

## Recommended Next Steps

1. **Clarify architecture choice:** Decide on standalone (Option A) vs. embedded (Option B) based on your main backend language and deployment preferences.

2. **Choose vector index:** Marqo for simplicity, FAISS for lightweight self-contained approach.

3. **Proof of concept:** Implement Phase 1 (baseline image encoding + search on 100 test images).

4. **Measure:** Profile CPU/memory/latency on actual VPS hardware; adjust batching and model selection as needed.

5. **Extend:** Add Phase 2 (text embeddings + hybrid search) once baseline is solid.

---

## References

- **SigLIP:** https://arxiv.org/abs/2403.19507
- **OpenCLIP:** https://github.com/mlfoundations/open_clip
- **Marqo:** https://www.marqo.ai
- **FAISS:** https://github.com/facebookresearch/faiss
- **Ollama & nomic-embed-text:** https://ollama.com
- **Transformers (Hugging Face):** https://huggingface.co/docs/transformers