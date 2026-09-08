# Vercel Deployment Guide

## 1. Prerequisites

- Node.js 18+ installed
- Git repository connected to Vercel
- Vercel account ([vercel.com](https://vercel.com))

## 2. Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Optional | Backend API base URL (e.g., `https://your-api.vercel.app`). If omitted, contact form uses relative URLs. |

> **Note:** The backend (Express + MySQL) requires separate deployment. It cannot run as-is on Vercel without converting to Serverless Functions and using a cloud database.

### Backend Environment Variables (if deploying backend separately)

| Variable | Required | Description |
|----------|----------|-------------|
| `GMAIL_USER` | Yes | Gmail address for contact form emails |
| `GMAIL_APP_PASSWORD` | Yes | Gmail App Password (not your regular password) |
| `DB_HOST` | Yes | MySQL database host |
| `DB_USER` | Yes | MySQL database username |
| `DB_PASSWORD` | Yes | MySQL database password |
| `DB_NAME` | Yes | MySQL database name |

**Never commit secrets to Git.** See `.env.example` for the full template.

## 3. Build Command

```bash
cd portfolio-ui && npm install && npm run build
```

This is configured in `vercel.json`.

## 4. Output Directory

```
portfolio-ui/dist
```

This is configured in `vercel.json`.

## 5. Vercel Configuration

The `vercel.json` file at the repository root configures:

- **Build command**: `cd portfolio-ui && npm install && npm run build`
- **Output directory**: `portfolio-ui/dist`
- **SPA routing**: All routes rewrite to `/index.html` (except `/api/*`)
- **Caching headers**:
  - `/assets/*` (hashed JS/CSS) → 1 year immutable cache
  - `/certifications/*` → 30-day cache
  - `/Mohamed_Sharshar_CV.pdf` → 7-day cache
  - `*.html` → No cache (always fresh)

## 6. Git Deployment (Recommended)

### Initial Setup

1. Push your repository to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will auto-detect the `vercel.json` configuration
5. Set environment variables in the dashboard
6. Click **Deploy**

### Subsequent Deployments

Every push to the `main` branch triggers an automatic deployment:

```bash
git add .
git commit -m "Performance optimization"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Run `cd portfolio-ui && npm install && npm run build`
3. Deploy the `portfolio-ui/dist` directory
4. Serve with the configured caching headers

### Preview Deployments

Every push to a non-main branch creates a preview deployment with a unique URL.

## 7. Manual Deployment (CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from repository root)
vercel

# Deploy to production
vercel --prod
```

## 8. Post-Deployment Verification

After deploying, verify the following:

```
[  ] Homepage loads and displays
[  ] Hero section with ParticleText animation works
[  ] 3D wireframe shapes render and animate
[  ] Stars and sparkles background visible
[  ] Scroll navigation between sections works
[  ] GooeyNav desktop navigation works
[  ] Mobile hamburger menu works
[  ] Experience section displays correctly
[  ] Skills section with icons renders
[  ] All 5 project cards display
[  ] Certificates gallery loads (scroll to section)
[  ] Certificate cards are draggable
[  ] Certificate modal opens on click
[  ] Contact form renders (API may not work without backend)
[  ] CV download link works (/Mohamed_Sharshar_CV.pdf)
[  ] No console errors (open DevTools → Console)
[  ] No failed network requests (DevTools → Network)
[  ] Mobile responsive layout works
[  ] Click spark effect works
[  ] Smooth scrolling works
```

### Performance Check

After deployment, run a Lighthouse audit:

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select: Performance, Accessibility, Best Practices, SEO
4. Click **Analyze page load**

Expected improvements over the pre-optimization state:
- **Performance**: Higher due to code splitting and lazy loading
- **SEO**: Significantly higher (meta tags added)
- **Best Practices**: Higher (no more console warnings from unused imports)

## 9. Troubleshooting

### Contact form returns network error
The backend API (`VITE_API_URL`) must be deployed and accessible. If not set, the form will try to use a relative URL which only works if the backend is on the same domain.

### 3D scene not loading
Check if Three.js chunk (`three-vendor-*.js`) loaded successfully in the Network tab. WebGL requires hardware acceleration — verify it's enabled in browser settings.

### Certificate images not showing
Images are in `/certifications/` directory. Verify they're included in the `dist` output after build.

### SPA routes returning 404
The `vercel.json` rewrite rule `"/(.*)" → "/index.html"` handles SPA routing. If routes 404, verify the `vercel.json` is in the repository root.
