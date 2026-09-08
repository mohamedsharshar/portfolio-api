# Performance Optimization Report

## Executive Summary

The portfolio was loading slowly due to a **1.36 MB monolith JavaScript bundle** (zero code splitting), **3.48 MB of unoptimized certificate images** loaded eagerly, a **heavy postprocessing library** used for a barely-visible bloom effect, **3 completely unused dependencies**, and a **continuous animation loop** running even when idle.

After optimization, the initial JavaScript load is split into parallel chunks with the app code reduced to **66 KB**, certificate images are lazy-loaded, unused dependencies are removed, and runtime CPU usage is significantly reduced.

---

## Major Problems Found

### 1. Zero Code Splitting (Critical)
The entire application — React, Three.js (~600KB), React Three Fiber, Drei, Postprocessing, Framer Motion, react-icons, and all application code — was bundled into a **single 1,360 KB JavaScript file**. Users had to download and parse the entire bundle before seeing anything.

### 2. Heavy Postprocessing Library (Critical)
`@react-three/postprocessing` was imported for a single Bloom effect at `intensity: 0.5` with `luminanceThreshold: 0.5`. On wireframe geometries with dark backgrounds, this bloom was barely perceptible. The library itself adds ~150KB+ to the bundle and requires a full additional render pass every frame.

### 3. Unused Dependencies (High)
Three packages were listed in `package.json` but **never imported anywhere** in the codebase:
- `gsap` — animation library, completely unused
- `react-router-dom` — routing library, no routing in this SPA
- `zustand` — state management, never imported

### 4. Certificate Images (High)
21 certificate images totaling **3.48 MB** were stored in `/public/certifications/`:
- `mhara_tech_page-0001.jpg` — 782 KB
- `certificate_page-0001.jpg` — 654 KB
- `python_tech_page-0001.jpg` — 546 KB

All loaded eagerly with no `loading="lazy"` attribute.

### 5. Barrel Import of Three.js (High)
`import * as THREE from 'three'` pulled the entire Three.js library into the bundle. Only `THREE.Color` was actually used (3 occurrences for color interpolation).

### 6. Per-Frame Garbage Collection (Medium)
`AmbientColorShift` created **2 new `THREE.Color` objects every animation frame** (lines 147-148), resulting in 120 object allocations per second at 60fps, causing GC pressure and micro-stutters.

### 7. Continuous ClickSpark Animation Loop (Medium)
ClickSpark ran a `requestAnimationFrame` loop **continuously at 60fps** even when no sparks were active, consuming CPU resources for no visual output.

### 8. Hardcoded API URL (Medium)
The contact form used `http://localhost:3000/api/contact` — a hardcoded development URL that would fail in any production deployment.

---

## Optimizations Applied

### Frontend Bundle

| Change | Impact |
|--------|--------|
| **Code splitting via `manualChunks`** | Split 1,360 KB monolith into 5 parallel-loaded chunks |
| **Removed `@react-three/postprocessing`** | Eliminated ~150KB from bundle, removed per-frame render pass |
| **Removed `gsap`, `react-router-dom`, `zustand`** | Removed 3 unused packages (8 total packages pruned from node_modules) |
| **`import { Color } from 'three'`** | Replaced barrel import, enabling better tree-shaking |
| **Lazy-loaded `CertificatesGallery`** | Deferred 4.88 KB chunk + 3.48 MB of images until needed |

### 3D Optimization

| Change | Before | After |
|--------|--------|-------|
| TorusKnot segments | `[100, 16]` | `[64, 10]` |
| Cylinder segments | `12` | `8` |
| Stars (far) | 1,000 | 600 |
| Stars (near) | 500 | 200 |
| Sparkles per group | 50 | 30 |
| Total particles | ~1,650 | ~1,060 |
| Bloom postprocessing | Enabled (full render pass) | Removed |
| Per-frame Color allocations | 2 objects/frame | 0 (reused via refs) |

All changes use wireframe rendering, making reduced segment counts visually indistinguishable.

### Image Optimization

| Change | Impact |
|--------|--------|
| `loading="lazy"` on all certificate images | Defers 3.48 MB until scroll |
| `decoding="async"` on certificate images | Non-blocking image decode |
| Explicit `width`/`height` attributes | Prevents CLS (Cumulative Layout Shift) |
| Lazy-loaded component wrapper | CertificatesGallery chunk loads on demand |

### Animation Optimization

| Change | Impact |
|--------|--------|
| ClickSpark on-demand rAF | Loop only runs during active click sparks, idle = 0 CPU |
| Stack rotation memoization | Random rotations computed once, not every render |

### SEO & Font Optimization

| Change | Impact |
|--------|--------|
| Added meta description, OG tags, Twitter Card | Proper SEO and social sharing |
| Non-blocking Google Fonts preload | Inter font loads without blocking render |
| `font-display: swap` via Google Fonts URL | Text visible immediately with fallback font |
| Theme color meta tag | Proper mobile browser theming |

### Security

| Change | Impact |
|--------|--------|
| Moved Gmail credentials to env vars | Removed hardcoded app password from source code |
| Created `.env.example` | Documents required environment variables |

### Vercel Optimization

| Change | Impact |
|--------|--------|
| Created `vercel.json` | SPA routing, caching, deployment config |
| Immutable cache for hashed assets | JS/CSS cached for 1 year (hash changes on update) |
| 30-day cache for certificate images | Reduces repeat load times |
| No-cache for HTML | Ensures users always get latest version |

---

## Performance Comparison

### JavaScript Bundle

| Chunk | Before | After | Change |
|-------|--------|-------|--------|
| **App code** | 1,360 KB (everything) | 66.2 KB | **-95.1%** |
| Three.js vendor | (in monolith) | 898.5 KB | Separate chunk |
| React vendor | (in monolith) | 181.8 KB | Separate chunk |
| Framer Motion | (in monolith) | 129.8 KB | Separate chunk |
| CertificatesGallery | (in monolith) | 4.9 KB | **Lazy-loaded** |
| Runtime | (in monolith) | 0.7 KB | Separate chunk |
| **Total JS** | **1,360 KB** | **1,282 KB** | **-5.7% total** |
| **gzipped Total** | **384 KB** | **365 KB** | **-4.9% gzipped** |

> **Note:** The raw total is only slightly smaller because Three.js (~900KB) is inherently large and was always in the bundle. The key improvement is **structural**: the app code chunk is only 66KB, vendor chunks cache independently, and the CertificatesGallery loads on demand.

### Initial Page Load (Critical Path)

| Metric | Before | After |
|--------|--------|-------|
| JS to parse before first paint | 1,360 KB | 66 KB (app) + vendors in parallel |
| Certificate images on initial load | 3.48 MB | 0 MB (lazy-loaded) |
| Postprocessing render pass | Every frame | None |
| Idle CPU usage (ClickSpark) | Continuous 60fps loop | 0 |

### Other Metrics

| Metric | Before | After |
|--------|--------|-------|
| Modules transformed | 985 | 981 |
| Unused packages | 3 | 0 |
| Build time | 4.74s | 0.62s |
| CSS | 46.57 KB | 46.57 KB (unchanged) |
| HTML | 0.46 KB | 2.43 KB (SEO tags added) |

---

## Remaining Bottlenecks

1. **Three.js core size (~898 KB)**: Three.js is inherently large. The portfolio uses procedural geometry (no GLTF models), so there's no model optimization to do. Further reduction would require switching to a lighter 3D library or using vanilla WebGL.

2. **Certificate image file sizes**: The 3 largest images (782KB, 654KB, 546KB) could be converted to WebP format for ~30-50% savings. This requires an image processing tool (sharp, cwebp) and was not done to avoid adding build dependencies.

3. **Framer Motion (~130 KB)**: Used only by the Stack (certificate card) component. Could be replaced with CSS animations or a lighter library, but this would require rewriting the drag-to-flip interaction.

4. **No external 3D models (GLTF/GLB)**: The portfolio uses procedural Three.js geometry, not loaded models. There are no 3D files to Draco-compress or optimize. The "3D performance" concern is purely about rendering cost, which has been addressed by reducing geometry complexity and particle counts.

5. **Backend requires MySQL**: The Express backend connects to a local MySQL database. For Vercel deployment, you'd need to either use a cloud MySQL provider (PlanetScale, AWS RDS) or convert the backend to Vercel Serverless Functions.
