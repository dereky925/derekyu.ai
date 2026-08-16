# derekyu.ai

Personal project site for [Derek Yu](https://github.com/dereky925). Next.js, hosted on Vercel, media off GitHub.

```
This folder  →  GitHub  →  Vercel CDN  →  derekyu.ai
                              ↑
                     R2 / Mux videos
```

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy [`.env.example`](.env.example) to `.env.local` if you want a media CDN or email on the About page.

Edit copy and stills in [`lib/projects.ts`](lib/projects.ts) and `public/media/projects/`. Do not add videos to git.

## Launch checklist

### 1. Domain

`derekyu.ai` is purchased. Keep WHOIS privacy on. Do not buy hosting from the registrar.

### 2. GitHub

This repo is the source of truth. Push to `main`. Vercel deploys from that branch.

### 3. Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New Project** → import this repository.
3. Framework preset: Next.js. Root directory: `.`
4. Environment variables (Production):
   - `NEXT_PUBLIC_SITE_URL` = `https://derekyu.ai`
   - `NEXT_PUBLIC_MEDIA_BASE_URL` = your R2 public origin, once it exists
   - `NEXT_PUBLIC_EMAIL` = optional
5. Deploy. Confirm the `*.vercel.app` URL loads.

### 4. Point DNS at Vercel

In the Vercel project: **Settings → Domains → Add** `derekyu.ai` and `www.derekyu.ai`.

Vercel will show records. At your registrar:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `10.0.1.2` (confirm in the Vercel UI; this is Vercel’s usual apex) |
| CNAME | `www` | `cname.vercel-dns.com` |

If the domain lives on Cloudflare, keep the proxy **DNS only** (grey cloud) until the SSL certificate issues, then you can proxy if you want.

Redirect `www` → apex (or the reverse) using Vercel’s domain UI so there is one canonical host.

Wait for HTTPS to show **Valid**. Then visit https://derekyu.ai.

### 5. Videos (Cloudflare R2 or Mux)

Videos never go in this repo.

**R2 (simple mp4)**

1. Cloudflare dashboard → R2 → create a bucket, e.g. `derekyu-media`.
2. Enable a public development URL, or attach `media.derekyu.ai` as a custom domain.
3. Upload `projects/grokeye/demo.mp4` (1080p H.264, a few tens of MB).
4. Set `NEXT_PUBLIC_MEDIA_BASE_URL` on Vercel to that public origin (no trailing slash).
5. In [`lib/projects.ts`](lib/projects.ts), `video.src` is already `projects/grokeye/demo.mp4`. Once the file exists on R2, the case-study player uses it instead of YouTube.

**Mux (adaptive bitrate)**

Upload the clip in Mux, copy the playback ID, set `video.muxPlaybackId`. Poster stills can stay in `/public/media`.

Players use a still for LCP, `preload="metadata"`, and only load the file after click / near viewport.

### 6. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property `https://derekyu.ai`.
3. Verify with the **HTML tag** (paste into `app/layout.tsx` metadata `verification.google`) or the **DNS TXT** record Vercel/your registrar accepts.
4. **Sitemaps → Add** `https://derekyu.ai/sitemap.xml`.
5. Request indexing on `/` after the first production deploy.

Ranking takes time. The site already emits unique titles, a sitemap, `robots.txt`, and Person / CreativeWork JSON-LD.

## Performance rules

- Hero is a still, never a video.
- Stills go through `next/image` (AVIF/WebP).
- Motion is fade / hover only; `prefers-reduced-motion` is honored.
- Keep git small: compress stills; no mp4/mov in commits.
