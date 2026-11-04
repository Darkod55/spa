# EmDash Marketing Template

A conversion-focused landing page template built with [EmDash](https://github.com/emdash-cms/emdash). Runs on any Node.js server with SQLite and local file storage. Modular content blocks let you assemble pages from reusable sections without touching code.

![Marketing template homepage](https://raw.githubusercontent.com/emdash-cms/emdash/main/assets/templates/marketing/latest/homepage-light-desktop.jpg)

## What's Included

- Hero section with CTAs
- Feature grid
- Testimonials
- Pricing cards
- FAQ accordion
- Contact page with direct email links
- SEO metadata and JSON-LD
- Dark/light mode

## Pages

| Page | Route |
|---|---|
| Homepage | `/` |
| Pricing | `/pricing` |
| Contact | `/contact` |
| 404 | fallback |

## Screenshots

| | Desktop | Mobile |
|---|---|---|
| Light | ![homepage light desktop](https://raw.githubusercontent.com/emdash-cms/emdash/main/assets/templates/marketing/latest/homepage-light-desktop.jpg) | ![homepage light mobile](https://raw.githubusercontent.com/emdash-cms/emdash/main/assets/templates/marketing/latest/homepage-light-mobile.jpg) |
| Dark | ![homepage dark desktop](https://raw.githubusercontent.com/emdash-cms/emdash/main/assets/templates/marketing/latest/homepage-dark-desktop.jpg) | ![homepage dark mobile](https://raw.githubusercontent.com/emdash-cms/emdash/main/assets/templates/marketing/latest/homepage-dark-mobile.jpg) |

## Infrastructure

- **Runtime:** Node.js 22+
- **Database:** SQLite (`data.db`, created on first run)
- **Storage:** Local filesystem (`uploads/`)
- **Framework:** Astro SSR with `@astrojs/node` (`standalone`)

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:4321/_emdash/admin and complete the setup wizard. EmDash runs database migrations and applies the marketing seed during setup. The site is available at http://localhost:4321.

## Deploy on xCloud

This repo is set up for xCloud’s Astro SSR flow:

1. In xCloud: **Add New Site → Astro → Deploy via Git** and use `https://github.com/Darkod55/spa.git` (branch `main`).
2. Confirm detection: **Node.js** app, serving mode **SSR (Node process)**.
3. Keep start command `node ./dist/server/entry.mjs` and port `3000`.
4. Set Node.js to **22** (matches `.nvmrc`).
5. Paste production values from `.env.example` into xCloud’s Environment file — especially `SITE_URL`, `EMDASH_SITE_URL`, and a new `EMDASH_ENCRYPTION_KEY`.
6. After deploy, ensure the site process can write `data.db` and `uploads/` in the app directory (EmDash needs both).
7. Open `/_emdash/admin` once to finish CMS setup, then turn on **Auto-deploy on push**.

## Want Cloudflare Instead?

See the [Cloudflare variant](../marketing-cloudflare) for a version that deploys to Cloudflare Workers with D1 and R2.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/marketing-cloudflare)

## See Also

- [All templates](../)
- [EmDash documentation](https://docs.emdashcms.com/)

## How to add a blog post

1. Add a cover image under `src/assets/images/blog/` (jpg/webp/png).
2. Create `src/content/blog/your-slug.mdx` (plain `.md` also works) with frontmatter:

```yaml
---
title: "Your title"
highlight: "optional highlight phrase"
excerpt: "Intro / card summary / meta description."
category: "Strategy" # Strategy | Branding | Websites | Content | SEO | Paid | Social | Events | Data
tags: ["Strategy", "Optional tag"]
author: "mandy" # must match a slug in src/data/team.ts
publishDate: 2026-10-14
cover: "../../assets/images/blog/your-cover.jpg"
coverAlt: "Describe the cover image"
coverPosition: "center" # optional object-position
readingTime: "7 min read" # optional — calculated from word count if omitted
draft: false # drafts are excluded from production builds
---
```

3. Write the body in Markdown/MDX. Available brand components (no import needed in MDX):

- `<PullQuote>…</PullQuote>`
- `<InlineImage src={importedAsset} alt="…" caption="…" position="60% 50%" />`
- `<KeyTakeaways items={["…", "…"]} />`

4. Use `##` headings for article sections — they power the “In this article” contents card (shown when there are 3+ h2s) and auto-numbering.
5. The post appears at `/blog/your-slug` after the next build/dev refresh.
6. Optional: set `featured: true` to pin a post in the archive featured strip (otherwise the newest post is featured).
7. The archive at `/blog` supports `?category=Strategy` and `?page=2` filters.
