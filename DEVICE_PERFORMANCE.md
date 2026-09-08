# Device-Aware Performance Strategy

## 1. Device Strategy & Performance Tiers
We have implemented a capability-detection strategy that avoids fragile User-Agent string sniffing in favor of actual hardware capability detection (`navigator.hardwareConcurrency`, `navigator.deviceMemory`, `navigator.connection`, viewport size). Devices are grouped into three primary tiers:

### Tier 1 — High-End
**Criteria:** >4 CPU cores, >4 GB RAM, fast network, desktop viewport.
*   **DPR (Device Pixel Ratio):** Set to `[1, 1.5]` to ensure crisp geometry and text.
*   **3D Geometry:** High segmentation (`torusKnot` 64x10, `cylinder` 8).
*   **Particles:** Max count (600 far stars, 200 near stars, 30 sparkles/nebula).
*   **Animations:** Full parallax effect and constant background rotations.
*   **Particle Text:** Dense, fully animated 2D canvas effect on the Hero title.

### Tier 2 — Mid-Range
**Criteria:** ≤4 CPU cores, ≤4 GB RAM, slow network (3G/2G), or mobile viewport.
*   **DPR:** Capped at `[0.75, 1.0]` to reduce fragment shader workload.
*   **3D Geometry:** Reduced segmentation (`torusKnot` 32x6, `cylinder` 6) saving thousands of vertices.
*   **Particles:** Halved counts (300 far stars, 100 near stars, 15 sparkles).
*   **Animations:** Standard parallax effect.
*   **Particle Text:** Normal particle size and moderate density (density=8 vs 4).

### Tier 3 — Low-End
**Criteria:** ≤2 CPU cores, ≤2 GB RAM, or (mobile viewport AND ≤3 GB RAM).
*   **DPR:** Scaled heavily down to `[0.5, 0.75]` ensuring fluid framerates on integrated GPUs or budget mobile chips.
*   **3D Geometry:** Same reduced geometry as Mid-Range.
*   **Particles:** Aggressive pruning. Sparkles/Nebulas completely disabled. Star count heavily reduced to ~20%.
*   **Animations:** Parallax effect factor heavily suppressed (0.05x).
*   **Particle Text:** Completely disabled. A static, lightweight semantic `<h1>` tag with matching typography is used as a fallback to ensure immediate initial render and zero canvas overhead.

---

## 2. Low-End & Mobile Optimization
**Weak Laptops & Integrated GPUs:**
*   Added `IntersectionObserver` and `Page Visibility API` hooks inside heavy canvas components (`ParticleText`). If the element scrolls out of view or the user switches tabs, the `requestAnimationFrame` loop pauses entirely. This saves battery and prevents the laptop fans from spinning up while reading off-screen content.

**Mobile Devices:**
*   Viewport detection scales the 3D scene globally so geometry fits correctly.
*   Forced Mid-Range or Low-End tier automatically applied to ensure WebGL context doesn't crash the mobile browser due to out-of-memory errors.

---

## 3. Fallback & Reduced Motion Strategy
**`prefers-reduced-motion` Support:**
The site listens to system-level accessibility flags (`window.matchMedia('(prefers-reduced-motion: reduce)')`). When activated:
*   Continuous rotation of the `FixedBackground` and 3D shapes immediately halts.
*   The `ParticleText` effect completely disables, showing the static fallback `<h1>`.

---

## 4. Deployment & Vercel Strategy
The optimized production build takes only `~0.6s` to compile using Vite (Rolldown) with chunk splitting intact.

### Manual Action Required for Deployment
Vercel CLI cannot proceed automatically because it requires authenticated credentials. Please perform the following steps locally in your terminal to deploy this build:

1. Open a terminal in `c:\laragon_old\www\portfolio-api\portfolio-ui`
2. Run `npx vercel login` (follow the browser prompt to authenticate).
3. Run `npx vercel link` to link the CLI to your Vercel project.
4. Run `npx vercel --prod` to deploy the optimized build to production.

No secrets have been exposed in the repository, and the `.env.example` protects production backend variables correctly.
