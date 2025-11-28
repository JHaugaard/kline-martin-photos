# Kline-Martin Photos - Project Brief

## Project Overview

A private family photo gallery for approximately 20 users to browse, search, and share ~1,100 images from a curated family archive. The system combines traditional keyword-based search with semantic search capabilities, allowing family members to find photos using natural language queries like "Christmas at the cabin" or "Pat and Jack with the old car."

The interface prioritizes clean, uncluttered design with a responsive grid layout. Access is restricted to invited family members via magic link authentication.

---

## Problem Statement

A family photo archive of ~1,100 images needs to be accessible to approximately 20 family members in a way that makes finding specific photos easy and enjoyable.

**Why This Matters:**
- Family photos are scattered or inaccessible to most family members
- Finding specific photos requires knowing exactly where they are or scrolling through everything
- No current system combines keyword metadata with semantic understanding of image content
- Sharing individual photos with non-family members is cumbersome

---

## Project Goals

### Primary Goal
Enable family members to quickly find and enjoy photos from the family archive using intuitive search that understands both keywords and natural language descriptions.

### Secondary Goals
- Provide a clean, distraction-free viewing experience
- Allow easy sharing of individual photos via link
- Enable admin users to maintain and improve keyword metadata over time
- Ensure the system is accessible on both desktop and mobile devices

---

## Functional Requirements

### Core Functionality

The gallery serves as a searchable, browsable interface to a curated photo collection stored in cloud storage (Backblaze B2).

**Key Features:**

- **Searchable Gallery**: Users can search using keywords (matching existing metadata) or natural language queries (leveraging semantic search). Results appear as a responsive grid.

- **Image Viewing**: Clicking an image opens a lightbox view for full-size viewing. Users can navigate between images within the lightbox.

- **Full-Resolution Download**: Users can download the original full-resolution image file.

- **Share via Link**: Users can generate a shareable link to an individual image. Shared links display the image without keywords/metadata (public-safe).

- **Admin Keyword Management**: Designated admin users can add, edit, or remove keywords associated with any image.

- **Magic Link Authentication**: Invited users receive a login link via email. No passwords to remember or manage.

### User Experience Expectations

- Grid layout with infinite scroll for browsing
- Responsive design that works well on desktop, tablet, and phone
- Fast initial load and smooth scrolling
- Search results appear quickly with clear relevance
- Clean, functional aesthetic — no visual clutter

---

## Success Criteria

**Essential Success Metrics:**
1. **Searchability**: Natural language queries return relevant results (e.g., "beach vacation" finds beach photos even if not explicitly tagged)
2. **Usability**: Family members can navigate, search, and view photos without instruction
3. **Adoption**: Family members actually use the gallery (measured informally)

**User Satisfaction Indicators:**
- "I found the photo I was looking for"
- "This is easy to use"
- "The site looks clean and loads quickly"

---

## Use Cases & Scenarios

### Use Case 1: Finding a Specific Memory
**Scenario**: A family member wants to find photos from a particular Christmas gathering.

**Expected behavior**:
- User types "Christmas" or "Christmas 2015" in search
- Grid updates to show matching photos
- User clicks an image to view in lightbox
- User downloads or shares the photo

### Use Case 2: Browsing Without a Specific Goal
**Scenario**: A family member wants to browse the archive casually.

**Expected behavior**:
- User scrolls through the infinite grid
- Lightbox opens on click for closer viewing
- User continues browsing from lightbox or returns to grid

### Use Case 3: Sharing a Photo Externally
**Scenario**: A family member wants to share a specific photo with someone who doesn't have gallery access.

**Expected behavior**:
- User finds the desired photo
- User generates a share link
- Link opens a standalone view of just that image (no keywords, no gallery access)

### Use Case 4: Admin Updates Keywords
**Scenario**: An admin notices a photo is missing relevant keywords.

**Expected behavior**:
- Admin views the photo
- Admin accesses keyword editing interface
- Admin adds/modifies keywords
- Changes are saved and reflected in future searches

---

## Edge Cases to Handle

### Search Returns No Results
**Problem**: User searches for something not in the archive or misspells a query.
**Expected behavior**: Display a clear "no results" message with suggestion to try different terms.

### Shared Link Access
**Problem**: Someone accesses a shared link — they should see only that image, not the full gallery.
**Expected behavior**: Shared link routes to a standalone image view with no navigation to other photos or metadata.

### Admin vs. Regular User Permissions
**Problem**: Regular users should not see or access keyword editing features.
**Expected behavior**: Keyword management UI only visible to users with admin role.

---

## Constraints & Assumptions

### Constraints
- **User base**: ~20 invited family members
- **Image count**: ~1,100 images (fixed collection for V1)
- **Storage**: Images stored in Backblaze B2
- **Existing assets**: 10 prototype images with JSON metadata files already in B2

### Assumptions
- All ~1,100 images will have keyword metadata (either pre-existing or to be added)
- Users have email addresses for magic link authentication
- Most users will access via modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile access is important but desktop is primary

---

## Out of Scope (For Initial Version)

The following features are explicitly deferred to V2:
- **Uploading new photos**: V1 uses a fixed collection; adding photos will be an admin feature later
- **Commenting on photos**: Social features deferred
- **Organizing into albums**: Flat grid for V1; album/folder organization for V2
- **Bulk operations**: Batch download, bulk sharing, etc.
- **Image editing**: Cropping, filters, etc.

---

## Deployment Intent

**Target Environment:** Public Deployment

- This project needs to be accessible online to ~20 family members
- Will require hosting infrastructure
- Full workflow through deploy-guide and optionally ci-cd-implement
- Authentication required to restrict access

---

## Learning Goals

**What I Want to Learn:**
- Implementing semantic image search with embeddings
- Integrating CLIP/SigLIP image encoders with a search backend
- Building a clean, responsive gallery interface

**Skills to Practice:**
- Working with vector databases/indices
- Connecting frontend to embedding-based search
- Authentication with magic links

---

## Initial Tech Thoughts (User Suggestions - Not Requirements)

**Note:** These are initial technology ideas from the user, captured for reference but NOT treated as requirements. The tech-stack-advisor skill will help explore options.

**From user's research (documented in `/docs/`):**
- Image embeddings: OpenCLIP or SigLIP (ViT-B models)
- Text embeddings: Ollama with `nomic-embed-text`
- Vector storage: Marqo, FAISS, or similar
- Image storage: Backblaze B2 (already in use)
- Deployment target: VPS (8 cores, 32 GB RAM, 400 GB storage) — referenced in research docs

The research documents provide detailed implementation patterns for the semantic search pipeline. These inform but do not constrain the tech stack decision.

---

## Next Steps

**Recommended workflow:**
1. Review this brief
2. Invoke `tech-stack-advisor` skill to explore technology options
3. Invoke `deployment-advisor` skill to plan deployment strategy
4. Invoke `project-spinup` skill to create project foundation

**After project-spinup**, the workflow continues:
- Build core features
- `test-orchestrator` (optional, when ready for testing setup)
- `deploy-guide` (deploy your application)
- `ci-cd-implement` (optional, for automation)

---

Ready to proceed? Invoke `tech-stack-advisor` to explore technology options.
