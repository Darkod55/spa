# Theme & design tokens guide

This site keeps EmDash for content. Visual design is controlled by CSS tokens and the layout in `src/layouts/Base.astro`.

The old Halden marketing demo content has been cleared to simple page stubs. Shared block components still exist under `src/components/blocks/` so the CMS editor keeps working — restyle or replace them as you build your own design.

---

## Where to change what

| What | File |
|------|------|
| **Colors, type scale, spacing, radii** (your brand) | [`src/styles/theme.css`](src/styles/theme.css) |
| Default token catalogue (don’t edit for day-to-day work) | [`src/styles/tokens.css`](src/styles/tokens.css) |
| **Webfonts** (which Google fonts load) | [`astro.config.mjs`](astro.config.mjs) → `fonts: [...]` |
| Header / footer / logo / shared UI classes | [`src/layouts/Base.astro`](src/layouts/Base.astro) |
| Logo image file | [`public/logo.svg`](public/logo.svg) |
| Page sections (hero, FAQ, etc.) | EmDash admin → Pages, or `src/components/blocks/` |

**Rule of thumb:** put brand overrides in `theme.css`. Leave `tokens.css` as the reference list of available variables.

---

## Colors

Tokens use CSS variables on `:root`. Many defaults support light and dark via `light-dark(light, dark)`.

In `theme.css` we currently set plain values (same in both modes) using Square Peg navy / red from the logo:

```css
:root {
  --color-brand: #012169;      /* primary / buttons */
  --color-on-brand: #ffffff;   /* text on brand */
  --color-accent: #c8102e;     /* small accents only */
  --color-bg: #ffffff;
  --color-text: #012169;
}
```

### Important color tokens

| Token | Used for |
|-------|----------|
| `--color-bg` | Page background |
| `--color-surface` | Cards, panels, menus |
| `--color-sunken` | Recessed sections |
| `--color-text` | Main copy |
| `--color-text-secondary` | Nav links, leads |
| `--color-muted` | Meta / quieter text |
| `--color-border` | Subtle edges |
| `--color-brand` | Primary buttons / brand fill |
| `--color-brand-strong` | Brand hover |
| `--color-on-brand` | Text/icons on brand |
| `--color-accent` | Small highlights (not whole UI) |
| `--color-night` | Dark band sections |
| `--glow-daylight` / `--glow-dusk` | Panel glows (`none` = flat) |

Different light vs dark:

```css
:root {
  --color-bg: light-dark(#ffffff, #0b1220);
  --color-text: light-dark(#012169, #f8fafc);
}
```

---

## Fonts

### 1. Load a face (`astro.config.mjs`)

```js
fonts: [
  {
    provider: fontProviders.google(),
    name: "Inter",              // change this name to another Google font
    cssVariable: "--font-body",
    weights: [400, 500, 600, 700],
    fallbacks: ["sans-serif"],
  },
  {
    provider: fontProviders.google(),
    name: "Instrument Serif",   // display / headlines
    cssVariable: "--font-display",
    weights: [400],
    styles: ["normal", "italic"],
    fallbacks: ["serif"],
  },
],
```

`Base.astro` already injects:

```astro
<Font cssVariable="--font-body" preload />
<Font cssVariable="--font-display" preload={[{ style: "normal" }]} />
```

### 2. Assign roles (`theme.css`)

```css
:root {
  --font-heading: var(--font-body); /* h1–h6 if you don’t want the serif */
  /* --font-display stays for hero-style headlines unless you override it */
}
```

Self-hosted fonts: put files in `public/fonts/`, add `@font-face` in `theme.css`, then set `--font-body` / `--font-display` to those family names.

---

## Font sizes

| Token | Role |
|-------|------|
| `--font-size-display` | Hero headline (`clamp` grows with viewport) |
| `--font-size-h2` | Section titles |
| `--font-size-xs` … `--font-size-6xl` | Type scale |
| `--leading-tight` / `--leading-snug` / `--leading-normal` | Line height |
| `--tracking-tight` / `--tracking-snug` | Letter spacing |

Example:

```css
:root {
  --font-size-display: clamp(2.5rem, 6vw, 4.5rem);
  --font-size-h2: clamp(1.75rem, 3vw, 2.5rem);
  --font-size-base: 1.0625rem;
}
```

---

## Spacing & layout

| Token | Role |
|-------|------|
| `--spacing-xs` … `--spacing-5xl` | General spacing |
| `--wide-width` | Main content max width (default 1200px) |
| `--max-width` | Narrow reading column |
| `--gutter` | Side padding on small screens |
| `--section-space` | Vertical gap between major sections |

```css
:root {
  --wide-width: 1120px;
  --section-space: clamp(4rem, 8vw, 6rem);
}
```

---

## Radii, motion, shadows

| Token | Role |
|-------|------|
| `--radius-sm` … `--radius-full` | Corner radii |
| `--radius-media` | Images |
| `--ease-out`, `--transition-*` | Motion |
| `--shadow-card`, `--shadow-glass`, … | Elevation |

---

## Global UI classes (in `Base.astro`)

Reuse these when building custom sections so spacing stays consistent:

**Layout:** `.container`, `.section`, `.sheet`, `.sheet--sunken`, `.sheet--night`

**Type:** `.display`, `.eyebrow`, `.lead`, `.section-header`, `.section-headline`, `.section-subheadline`

**Controls:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-sm`, `.btn-lg`, `.actions`, `.text-link`

**Surfaces:** `.card`, `.media`, `.avatar`

---

## Logo

Theme logo: `public/logo.svg` (wired in `src/utils/site.ts`).  
If you set a logo in EmDash **Settings**, that overrides the theme file.

---

## Suggested workflow for your own design

1. Set brand colors / type in `theme.css`.
2. Swap fonts in `astro.config.mjs` if needed.
3. Adjust header/footer markup and CSS in `Base.astro`.
4. Rebuild page sections: either restyle `src/components/blocks/*` or replace `MarketingBlocks.astro` with your components and update the CMS block map.
5. Fill real copy in EmDash admin (Home, About, Services, Blog, Contact).

---

## Local preview

```bash
nvm use   # Node 22
npm run dev
```

- Site: http://localhost:4321/  
- Admin: http://localhost:4321/_emdash/admin  
