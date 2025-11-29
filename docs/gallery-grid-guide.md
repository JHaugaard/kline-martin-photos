# Gallery Grid Component Guide

## Overview

This guide explains the gallery grid system that displays responsive image layouts with pagination. The design is clean and understated, focusing the viewer's attention on the images themselves.

---

## Architecture Overview

```
GalleryPage (main page, handles pagination state)
  ├── ImageGrid (responsive grid layout)
  │   └── ImageCard[] (individual image cards)
  └── PaginationControls (next/previous buttons)

Supporting:
  ├── useGalleryPagination (pagination state management)
  ├── getPlaceholderImages (development image generator)
  └── Database connection (to be added for B2 images)
```

---

## Components Explained

### 1. ImageCard Component ([src/components/gallery/ImageCard.tsx](src/components/gallery/ImageCard.tsx))

**Purpose**: Displays a single image in the gallery grid.

**Features**:
- Square aspect ratio (aspect-square)
- Hover state with subtle overlay
- Image scaling on hover (visual feedback)
- Title overlay on hover (if title exists)
- Placeholder icon when no image is available
- Keyboard accessible (focus ring)

**Design Details**:
- Rounded corners: `rounded-lg` (subtle, not aggressive)
- Hover shadow: `hover:shadow-md` (adds depth without clutter)
- Image scaling: `group-hover:scale-105` (smooth 5% zoom)
- Overlay darkness: `opacity-5` on hover (barely noticeable)

**Responsive Images**:
```typescript
sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
```
This tells Next.js Image to serve:
- Mobile: 50% of viewport width
- Tablet: 33% of viewport width
- Desktop: 25% of viewport width
- Large desktop: 20% of viewport width

**Usage**:
```typescript
<ImageCard
  image={imageData}
  onClick={() => openLightbox(imageData)}
/>
```

---

### 2. ImageGrid Component ([src/components/gallery/ImageGrid.tsx](src/components/gallery/ImageGrid.tsx))

**Purpose**: Renders a responsive grid of ImageCard components.

**Responsive Breakpoints**:
```typescript
grid-cols-2 gap-2        // Mobile: 2 columns, small gap
sm:grid-cols-3 sm:gap-3  // Tablet: 3 columns, medium gap
md:grid-cols-4 md:gap-4  // Desktop: 4 columns, normal gap
lg:grid-cols-5 lg:gap-4  // Large: 5 columns, normal gap
```

**Gap Scaling**:
- Mobile (2px gap): Images feel more compact
- Tablet/Desktop (3-4px gap): More breathing room
- Helps images feel natural at different scales

**States Handled**:
- `isLoading` - Shows skeleton loading placeholders
- Empty state - Shows helpful message when no images
- Normal state - Displays all images

**Empty State Design**:
```typescript
<svg>...image icon...</svg>
<p className="text-gray-500">No images found</p>
```
- Subtle icon (small, gray)
- Helpful text
- Centered and minimal

---

### 3. Gallery Page ([src/app/(gallery)/gallery/page.tsx](src/app/(gallery)/gallery/page.tsx))

**Purpose**: Main page that orchestrates image loading, pagination, and grid display.

**Key Responsibilities**:
1. Load images (placeholder during dev, real from B2 in production)
2. Manage pagination state using `useGalleryPagination`
3. Slice images to show current page
4. Render components with proper props

**State Management**:
```typescript
const [images, setImages] = useState<ImageData[]>([])
const [isLoading, setIsLoading] = useState(true)

const pagination = useGalleryPagination({
  itemsPerPage: ITEMS_PER_PAGE,  // 20 images per page
  totalItems: images.length,
})

const visibleImages = images.slice(
  pagination.startIndex,
  pagination.endIndex
)
```

**Development vs Production**:
```typescript
// Development: placeholder images
const placeholderImages = await getPlaceholderImages(100)
setImages(placeholderImages)

// Production: real images from Supabase
// const { data: realImages } = await supabaseServer
//   .from('images')
//   .select('*')
//   .order('created_at', { ascending: false })
```

---

### 4. PaginationControls Component ([src/components/gallery/PaginationControls.tsx](src/components/gallery/PaginationControls.tsx))

**Purpose**: Displays previous/next buttons and page indicator.

**Features**:
- Previous button (disabled when on first page)
- Next button (disabled when on last page)
- Page indicator showing current/total pages
- Loading state support
- Minimal, subtle design

**Button States**:
```
enabled:  hover:bg-gray-100 (light hover)
disabled: opacity-50 (faded appearance)
```

**Variants**:
1. `PaginationControls` - Traditional pagination (prev/next)
2. `LoadMoreButton` - Infinite scroll style (single button)

---

### 5. useGalleryPagination Hook ([src/hooks/useGalleryPagination.ts](src/hooks/useGalleryPagination.ts))

**Purpose**: Manages all pagination state and calculations.

**What It Tracks**:
- Current page number
- Items per page
- Total pages (calculated from total items)
- Start/end indexes for array slicing
- Whether you can go next/previous

**API**:
```typescript
const {
  currentPage,        // 1, 2, 3, etc.
  itemsPerPage,       // 20 (configurable)
  totalPages,         // Math.ceil(totalItems / itemsPerPage)
  startIndex,         // (currentPage - 1) * itemsPerPage
  endIndex,          // startIndex + itemsPerPage
  goToPage,          // (page) => setPage(page)
  nextPage,          // () => setPage(current + 1)
  previousPage,      // () => setPage(current - 1)
  reset,             // () => setPage(1)
  canGoPrevious,     // currentPage > 1
  canGoNext,         // currentPage < totalPages
} = useGalleryPagination({ itemsPerPage: 20, totalItems: 100 })
```

**Usage**:
```typescript
const visibleImages = images.slice(
  pagination.startIndex,
  pagination.endIndex
)

<button onClick={pagination.nextPage}>Next</button>
```

---

### 6. Placeholder Image Generator ([src/lib/gallery/placeholder.ts](src/lib/gallery/placeholder.ts))

**Purpose**: Generates realistic development images without needing real B2 setup.

**Functions**:
- `generatePlaceholderImages(count)` - Synchronous generator
- `getPlaceholderImages(count)` - Async with fake delay
- `PLACEHOLDER_CATEGORIES` - Pre-selected images by category

**Features**:
- Uses Unsplash API for realistic images
- Assigns random keywords for search testing
- Creates realistic metadata (titles, dates)
- Simulates database response structure

**Development Workflow**:
```typescript
// In development, gallery loads these:
const placeholderImages = await getPlaceholderImages(100)

// When ready for production, replace with:
const { data: realImages } = await supabaseServer
  .from('images')
  .select('*')
```

---

## Design Philosophy

### Understated and Clean

**Characteristics**:
- Minimal borders (only on cards via rounded corners)
- Subtle shadows (`hover:shadow-md` only on hover)
- No background colors behind images
- Neutral gray palette
- Focus on the images, not the UI

**Implementation**:
```typescript
// ✅ Good: Subtle hover effect
className="hover:shadow-md"

// ❌ Bad: Too much visual clutter
className="border border-gray-300 bg-gray-100 shadow-lg"
```

### Responsive Without Jarring Changes

**Gap Scaling**:
- Mobile: `gap-2` (8px)
- Tablet: `gap-3` (12px)
- Desktop: `gap-4` (16px)

This creates visual consistency while adapting to screen size.

**Column Count**:
```
Mobile:  2 cols → Compact, thumb-friendly
Tablet:  3 cols → More content visible
Desktop: 4 cols → Gallery-like viewing
Large:   5 cols → Immersive grid
```

### Accessibility

**Features**:
- Keyboard focus ring: `focus:ring-2 focus:ring-gray-900`
- Button disabled states: `disabled:opacity-50`
- ARIA labels: `aria-label="Previous page"`
- Semantic HTML: `<button>` for clickable elements
- Image alt text: `alt={image.title || image.filename}`

---

## Responsive Behavior

### Mobile (< 640px)
```
┌─────┬─────┐
│ img │ img │  ← 2 columns, gap-2 (8px)
├─────┼─────┤
│ img │ img │
└─────┴─────┘
```
- Fits screen width well
- Easy to tap on phones
- Scrolls naturally

### Tablet (640px - 1024px)
```
┌─────┬─────┬─────┐
│ img │ img │ img │  ← 3 columns, gap-3 (12px)
├─────┼─────┼─────┤
│ img │ img │ img │
└─────┴─────┴─────┘
```
- Balanced for tablet screens
- Shows more images at once
- Still readable and interactive

### Desktop (1024px+)
```
┌─────┬─────┬─────┬─────┬─────┐
│ img │ img │ img │ img │ img │  ← 5 columns, gap-4 (16px)
├─────┼─────┼─────┼─────┼─────┤
│ img │ img │ img │ img │ img │
└─────┴─────┴─────┴─────┴─────┘
```
- Full-screen gallery experience
- Lots of images visible
- Breathing room between images

---

## Loading States

### Initial Load
```
Gallery
┌─────────────────┐
│ ░░░░░░░░░░░░░░░│  ← Skeleton loader (animated pulse)
│ ░░░░░░░░░░░░░░░│
└─────────────────┘
```

**Implementation**:
```typescript
{isLoading &&
  Array.from({ length: 10 }).map((_, i) => (
    <div className="aspect-square animate-pulse rounded-lg bg-gray-100" />
  ))}
```

### Pagination Load
```
Page 1 of 5

[←] Page [1] of [5] [→]
```
The buttons disable while loading, providing feedback.

---

## Connecting to Real Images (B2)

### Step 1: Create Image URL Generator
```typescript
// src/lib/b2/signed-urls.ts
export async function generateSignedUrl(imageId: string): Promise<string> {
  // Use Backblaze B2 API to create signed URL
  // Return: https://b2-bucket.s3.amazonaws.com/image-id?auth=token
}
```

### Step 2: Update Database Query
```typescript
// In gallery/page.tsx
const { data: realImages } = await supabaseServer
  .from('images')
  .select('id, filename, title, keywords, created_at')

// Add image URLs
const imagesWithUrls = realImages.map(img => ({
  ...img,
  imageUrl: await generateSignedUrl(img.id)
}))

setImages(imagesWithUrls)
```

### Step 3: Update ImageCard
```typescript
// Already supports imageUrl prop:
{image.imageUrl ? (
  <Image src={image.imageUrl} />
) : (
  <div>Placeholder</div>
)}
```

---

## Future Enhancements

### 1. Lightbox/Modal Viewer
```typescript
// Click ImageCard → open full-screen image viewer
// Features: keyboard navigation, swipe on mobile, zoom
<Lightbox image={selectedImage} onClose={handleClose} />
```

### 2. Infinite Scroll
```typescript
// Replace pagination with automatic loading
// Detect when user scrolls near bottom
// Load more images automatically
const { ref: bottomRef } = useInView({ onChange: loadMore })
```

### 3. Search Integration
```typescript
// Filter images by keywords or semantic search
const filteredImages = images.filter(img =>
  img.keywords.some(k => k.includes(searchQuery))
)
```

### 4. Lazy Loading
```typescript
// Already using Next.js Image component
// Images load as they scroll into view
// priority={false} enables lazy loading
```

### 5. Image Filters
```typescript
// Add UI controls for filtering
// By date, keywords, role (admin view)
const filtered = images
  .filter(img => img.createdAt > startDate)
  .filter(img => matchesKeywords(img))
```

---

## Troubleshooting

### Images not showing
**Problem**: Placeholder icons show instead of images
**Causes**:
- `imageUrl` is not set on image objects
- Image service (B2) is not configured
- Images failed to load

**Solution**:
- Check that `getPlaceholderImages()` sets `imageUrl`
- When moving to B2, ensure signed URLs are generated
- Check browser DevTools Network tab for failed requests

### Grid layout looks wrong
**Problem**: Columns not responsive, wrong gap size
**Causes**:
- Tailwind CSS not processing responsive classes
- Browser zoom interfering with media queries

**Solution**:
- Run `pnpm build` to verify Tailwind is working
- Check DevTools → responsive design mode
- Clear browser cache

### Pagination not working
**Problem**: Can't navigate between pages
**Causes**:
- Hook state not updating
- Images state is empty

**Solution**:
- Check browser console for errors
- Verify `images.length > ITEMS_PER_PAGE` (pagination only shows if needed)
- Check that `useGalleryPagination` is being called

---

## File Reference

| File | Purpose |
|------|---------|
| [src/components/gallery/ImageCard.tsx](src/components/gallery/ImageCard.tsx) | Single image display |
| [src/components/gallery/ImageGrid.tsx](src/components/gallery/ImageGrid.tsx) | Grid layout |
| [src/components/gallery/PaginationControls.tsx](src/components/gallery/PaginationControls.tsx) | Pagination UI |
| [src/app/(gallery)/gallery/page.tsx](src/app/(gallery)/gallery/page.tsx) | Main page |
| [src/hooks/useGalleryPagination.ts](src/hooks/useGalleryPagination.ts) | Pagination logic |
| [src/lib/gallery/placeholder.ts](src/lib/gallery/placeholder.ts) | Development images |
| [src/types/index.ts](src/types/index.ts) | Type definitions |

---

## Design System Summary

### Spacing
| Element | Size | CSS |
|---------|------|-----|
| Grid gap (mobile) | 8px | `gap-2` |
| Grid gap (tablet/desktop) | 12-16px | `gap-3 md:gap-4` |
| Page padding | 16-24px | `px-4 py-6` |
| Section margin | 24px | `mb-6` |

### Typography
| Element | Style | CSS |
|---------|-------|-----|
| Title | Large, light weight | `text-2xl font-light` |
| Button text | Small, medium weight | `text-sm font-medium` |
| Helper text | Small, gray | `text-xs text-gray-500` |

### Colors
| Element | Color | CSS |
|---------|-------|-----|
| Text | Dark gray | `text-gray-900` |
| Secondary text | Medium gray | `text-gray-600` |
| Tertiary text | Light gray | `text-gray-500` |
| Borders | Very light | `border-gray-100` |
| Hover background | Light gray | `hover:bg-gray-100` |

---

## Next Steps

1. **Test locally**: `pnpm dev` → Visit `/gallery`
2. **Verify pagination**: Load 100+ images, navigate pages
3. **Check responsive**: Test on mobile, tablet, desktop
4. **Connect to B2** (Step 6): Replace placeholder with real images
5. **Add search** (Step 7): Filter by keywords
6. **Build lightbox** (Step 5): Click image to view full screen
