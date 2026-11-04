# Design system setup

How to stand up (or rebuild) the visual system used by The Square Peg Agency Astro site. Use this when cloning the project for a new brand, or when resetting the design layer.

**Stack:** Astro · plain CSS custom properties (no Tailwind) · Fontsource self-hosted fonts · Astro components for UI/chrome.

**Related:** SEO / AEO / GEO / agentic rules live in `.cursor/rules/seo-aeo-geo-agentic.mdc`. Preview tokens and components at `/styleguide`.

> Note: `THEME.md` describes an older EmDash template token layer (`tokens.css` / `theme.css`). Prefer **this file** and `src/styles/global.css` as the source of truth.

---

## 1. What you need before coding

Collect these in a clear format so tokens and assets can be filled in without guessing.

### Brand colours (hex)

Canonical names live in `src/design/surfaces.json` and CSS tokens in `global.css`.

| Token | Role | Hex | Notes |
|-------|------|-----|--------|
| `primary` | Dark blue | `#031433` | Heroes, footer, dark sections |
| `secondary` | Red | `#C8102E` | Buttons, labels, accents on light |
| `tertiary` | Royal blue | `#012169` | Diagonal / secondary dark bands |
| `white` / `gray` / `black` | Neutrals | `#FFF` / `#F4F5F7` / `#000` | Section surfaces |
| `secondary-on-primary` | Accessible red on primary | `#E8324C` | Text/marks on primary |
| `secondary-on-tertiary` | Accessible red on tertiary | `#FF8A9A` | Text/marks on tertiary |
| `secondary-deep` | Deep red | `#970C23` | Closing CTAs |

**Surface controls (CMS → class):** selecting Background / Text colour / Divider applies `bg-*`, `text-*`, `divider-*` (see `surfaceClasses()` in `src/design/surfaces.ts`). Add a colour once in `surfaces.json`, run `node scripts/sync-surface-fields.mjs`, then apply seed — every block that uses those fields picks it up.

**Rule:** never use brand secondary (`#C8102E`) for text on primary or tertiary — use the accessible on-* tints.

Legacy aliases (`--color-navy`, `--color-royal`, `--color-red`, `.bg-navy`, …) still resolve to the new tokens during migration.

### Typography

| Role | Family | Weights | Notes |
|------|--------|---------|--------|
| Headings | e.g. Oswald | 400–700 | Uppercase in this brand; set `--font-heading` |
| Body | e.g. Montserrat | 400–700 | Set `--font-body` |

Provide: font names, required weights, and whether to self-host (prefer **Fontsource**, `font-display: swap`, no Google CDN).

### Type scale

List each style with: CSS variable name, size (rem/`clamp`), weight, line-height, letter-spacing, transform.

Minimum set used here:

- Display / page H1 / CTA / H2 / H2 large / statement / H3 / tagline / eyebrow  
- Hero sub / lead / body / body long-form / small / meta / nav  

### Layout

| Token | Purpose |
|-------|---------|
| `--container-max` | Content max width (here `1280px`) |
| `--gutter` | Horizontal page padding |
| `--space-section-top` / `--space-section-bottom` | Section vertical rhythm |
| `--gap-lg` / `--gap-md` / `--gap-sm` | Stack gaps |
| `--radius` | Corner radius (`0` = sharp brand) |

Also note: mobile floor (here **360px**), and whether multi-column layouts should wrap via `flex-wrap` / `auto-fit` instead of fixed breakpoints where possible.

### Signature shapes (optional but brand-defining)

Document clip-paths / sizes:

- Parallelogram slant (buttons / labels / tags) — `--slant`
- Clipped-corner cards + accent edge
- Slanted section edges + overlap (`margin-top` negative)
- Diagonal bands / corner triangles
- Slash mark (triple stroke) and slash bullets

### Logos & icons

| Asset | Path | Format | Usage size |
|-------|------|--------|------------|
| Colour logo | `src/assets/logo/tspa-color.svg` | SVG | Header ~60px (48px small; 42px when scrolled) |
| White logo | `src/assets/logo/tspa-white.svg` | SVG | Footer ~60px (48px small) |
| Favicon | `public/logo.svg` | SVG | Browser tab |

Social icons: stroke (or fill) SVGs in `src/components/ui/icons/`, reusable.

### Navigation data

In `src/data/navigation.ts`, export:

- `mainNav` — `{ label, href }[]` (header + footer)
- `headerCta` — primary header button
- `auditBarLink` — preheader CTA (optional)
- `socialLinks` — `{ label, href, icon }[]`
- `legalLinks` — privacy / cookies etc.

Active route helper: `src/utils/isActive.ts`.

---

## 2. File map (create / edit these)

```
src/styles/global.css          ← tokens, reset, base type, shapes, forms (import once)
src/layouts/BaseLayout.astro   ← html shell, skip link, SiteChrome, main, Footer
src/components/layout/
  SiteChrome.astro             ← sticky wrapper + scroll shrink class
  AuditBar.astro               ← optional preheader
  Header.astro                 ← logo, nav, CTA, mobile menu
  Footer.astro                 ← slanted navy footer
src/components/ui/             ← Button, Label, NumberTab, SectionHeading,
                                 Container, SlashMark, SlashList, icons/*
src/data/navigation.ts
src/utils/isActive.ts
src/assets/logo/*.svg
src/pages/styleguide.astro     ← noindex preview of the system
.cursor/rules/seo-aeo-geo-agentic.mdc
```

EmDash CMS can keep using `src/layouts/Base.astro` for admin-driven routes; **marketing chrome and the design system use `BaseLayout.astro`**.

---

## 3. Setup steps (order)

### Step A — Dependencies

```bash
npm install @fontsource/<heading-font> @fontsource/<body-font>
```

Import only the weights you need in `global.css` (each package ships `font-display: swap`).

### Step B — Tokens in `global.css`

1. Replace `:root` colour, font, type-scale, and spacing variables with the brand sheet from §1.  
2. Keep naming stable (`--color-*`, `--fs-*`, `--font-*`) so components keep working.  
3. Set base element styles (`body`, `h1–h3`, `a`, lists) from those tokens — **no hard-coded hex/fonts in components** when a token exists.  
4. Keep focus styles: visible `:focus-visible`; for `clip-path` controls use a wrapper or drop-shadow ring.

### Step C — Base layout

`BaseLayout.astro` must:

- Import `../styles/global.css` once  
- Set `<html lang="…">`  
- Accept `title`, `description`, optional `robots` / `showAuditBar`  
- Render: skip link → `SiteChrome` → `<main id="main">` → `Footer`

### Step D — Chrome

1. Drop logos into `src/assets/logo/`.  
2. Fill `navigation.ts`.  
3. Wire `Header` / `AuditBar` / `Footer` to tokens + `Container` / `Button` where relevant.  
4. Sticky behaviour (if wanted): `SiteChrome` toggles `.is-scrolled`; compact logo sizes in CSS.  
5. Footer slant: `clip-path` + negative `margin-top`; ensure last main child has extra bottom padding (see `global.css` `main > :last-child`).

### Step E — UI kit

Implement or restyle under `src/components/ui/`:

| Component | Responsibility |
|-----------|----------------|
| `Container` | max-width + gutter |
| `Button` | variants/sizes, parallelogram, arrow |
| `Label` / `NumberTab` | parallelogram tags |
| `SectionHeading` | optional SlashMark + `.hl` by tone |
| `SlashMark` / `SlashList` | brand marks |
| `icons/*` | social / UI glyphs |

### Step F — Style guide

Keep `/styleguide` (`robots: noindex`) showing:

- Colour swatches (name + hex)  
- Type samples  
- Buttons on light / navy / royal / deep-red  
- Labels, tabs, cards, slants, bands  
- Slash marks/lists, form fields  
- Header/footer in context (via `BaseLayout`)

### Step G — Pages

Build sections only after the system above exists. Follow the SEO/AEO/GEO rule. Prefer design tokens and UI components; add section-level CSS sparingly.

---

## 4. Token checklist (copy into a new brand brief)

```text
[ ] --font-heading / --font-body (+ Fontsource packages & weights)
[ ] Brand colours + accessible on-dark tints
[ ] Neutrals + text colours (contrast checked)
[ ] Full --fs-* scale with weight / line-height / tracking notes
[ ] --container-max, --gutter, section spaces, gaps, --radius
[ ] --slant / shape notes
[ ] Colour + white logos (SVG)
[ ] mainNav, headerCta, socialLinks, legalLinks
[ ] Audit bar copy + link (or disabled)
[ ] Favicon
```

---

## 5. Do / don’t

**Do**

- Change brand values in `global.css` `:root` (or a thin brand layer imported after it).  
- Reuse UI components; pass variants via props.  
- Preview on `/styleguide` at 360 / 768 / 1024 / 1440.  

**Don’t**

- Hard-code colours/fonts that already exist as tokens.  
- Add Tailwind unless you deliberately migrate tokens into `@theme` / config as well.  
- Put primary brand CSS only inside EmDash `Base.astro` if marketing pages use `BaseLayout`.  
- Ship indexable pages before title, description, heading order, and crawlable copy are in place.

---

## 6. Quick verify

1. `npm run dev` → `/styleguide` renders fonts, colours, components.  
2. Header/footer logos correct on light and navy.  
3. Focus rings visible on parallelogram controls.  
4. Mobile menu + sticky chrome behave without layout jump.  
5. Footer slant overlaps the previous section without clipping text.
