# derekyu.ai

Personal project site for [Derek Yu](https://github.com/dereky925). Next.js, hosted on Vercel, media off GitHub.

```
This folder  →  GitHub  →  Vercel CDN  →  derekyu.ai
                              ↑
                     R2 / Mux videos
```

Vercel production is live at [https://derekyu-ai.vercel.app](https://derekyu-ai.vercel.app). GitHub repo: [dereky925/derekyu.ai](https://github.com/dereky925/derekyu.ai). Push to `main` deploys automatically.

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

Done. Project: `anduril1/derekyu-ai`. Production: [https://derekyu-ai.vercel.app](https://derekyu-ai.vercel.app). `NEXT_PUBLIC_SITE_URL` is set to `https://derekyu.ai`.

### 4. Point DNS at Vercel

`derekyu.ai` and `www.derekyu.ai` are attached to the Vercel project. The domain currently uses **Squarespace** nameservers (`nse*.squarespacedns.com`). In Squarespace: **Domains → derekyu.ai → DNS**. Remove the parking A records and the `www` CNAME to `ext-sq.squarespace.com`, then add:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `216.198.79.1` |
| A | `@` | `64.29.17.1` |
| CNAME | `www` | `814f716af2930029.vercel-dns-017.com.` |

Wait for DNS to propagate. Vercel issues HTTPS automatically. Then https://derekyu.ai should load.

Alternative: change nameservers at Squarespace to `ns1.vercel-dns.com` and `ns2.vercel-dns.com` instead of editing individual records.

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
