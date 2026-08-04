# Helder Vasconcelos Personal Website

## Project Overview

Minimal, grayscale personal website for Helder Vasconcelos, CTO at LayerX. A single-page static site built with Astro and deployed to Vercel, or as a container via the included Dockerfile.

The site was migrated from Next.js 14 (App Router) to Astro 7. There is no React left in the project — do not reintroduce it. Components are `.astro`; interactivity is plain TypeScript in `<script>` tags.

## Tech Stack

- **Framework**: Astro 7 (Vite)
- **Language**: TypeScript, strict (`astro/tsconfigs/strict`)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite`
- **Markdown**: Sätteri, Astro's default processor
- **Fonts**: Inter + JetBrains Mono, self-hosted via Fontsource
- **Serving**: static `dist/` — Vercel, or nginx in Docker

## Project Structure

```
h3vasc-web/
├── src/
│   ├── pages/
│   │   ├── index.astro          # The entire site
│   │   └── 404.astro
│   ├── layouts/
│   │   └── Layout.astro         # <head>, font imports, metadata
│   ├── components/
│   │   ├── CollapsibleSection.astro
│   │   ├── SocialIcon.astro
│   │   └── GlitteryBackground.astro
│   ├── data/                    # Content lives here, not in markup
│   │   ├── bio.md
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── writing.ts
│   │   └── social.ts
│   └── styles/
│       └── global.css
├── public/                      # avatar.jpg, favicon.svg
├── astro.config.mjs
├── Dockerfile
├── nginx.conf.template
└── vercel.json
```

## Commands

```bash
npm install
npm run dev       # localhost:4321
npm run build     # static build into dist/
npm run preview   # serve dist/ locally
npm run check     # astro check — type-checks .astro and .ts
```

There is no lint script. `npm run check` is the closest equivalent and should pass before committing.

## Content Updates

**Always prefer editing `src/data/` over editing markup.** Every section is driven by a typed array or a Markdown file.

- **Bio** → `src/data/bio.md`. Plain Markdown. External links get `target="_blank"` automatically (see the `externalLinks` hast plugin in `astro.config.mjs`) — do not hand-write `target` attributes.
- **Experience** → `src/data/experience.ts` (`Experience[]`)
- **Education** → `src/data/education.ts` (`Education[]`)
- **Writing** → `src/data/writing.ts` (`BlogPost[]`)
- **Social links** → `src/data/social.ts` (`SocialLink[]`). The `platform` field selects an SVG in `SocialIcon.astro`; adding a new platform means widening the `SocialPlatform` union and adding a branch there.

## Sections and Collapsing

Each page section is a `<CollapsibleSection id title defaultOpen?>` in `index.astro`. Behaviour:

- Built on native `<details>`/`<summary>` — expanding works without JavaScript.
- The chevron is a `>` glyph rotated 90° via CSS on `details[open]`.
- One global script in `CollapsibleSection.astro` wires **every** instance by querying `details[data-collapsible]`. Astro `<script>` tags are bundled once and module-scoped, so per-instance logic must go through DOM queries, never per-component state.
- Closing animates height before flipping `open`; during that window the element carries `.is-closing` so the chevron un-rotates immediately.
- `prefers-reduced-motion: reduce` skips the animation entirely.
- Currently **About** starts open (`defaultOpen`); Experience, Education and Writing start collapsed.

## Design Principles

- **Minimal & clean**: white background, grayscale palette only
- **Typography**: Inter for body, JetBrains Mono for metadata and labels
- **Responsive**: content column capped at `max-w-2xl`
- **Accessibility**: `aria-label` on icon links, decorative glyphs marked `aria-hidden`

### Color Palette

Defined in `src/styles/global.css` under `@theme` (Tailwind 4 is configured in CSS — there is no `tailwind.config.ts`):

- Background: White (#ffffff)
- Primary text: Gray-900 (#171717)
- Secondary text: Gray-700 (#404040)
- Metadata: Gray-500 (#737373)
- Accents: Gray-400 (#a3a3a3)
- Borders: Gray-200 (#e5e5e5)

The `gray` scale is overridden to Tailwind's `neutral` values; use `gray-*` utilities and nothing else.

## Deployment

**Vercel** — `vercel.json` sets `outputDirectory: dist`. Static export, no server runtime.

**Docker** — two-stage build (`node:22-alpine` → `nginx:1.29-alpine`):

```bash
docker build -t h3vasc-web .
docker run --rm -p 8080:8080 h3vasc-web
```

nginx config lives in `nginx.conf.template` and is rendered by the official image's envsubst entrypoint at startup, so `PORT` is overridable. If you edit that file, remember `${PORT}` is substituted but nginx runtime variables like `$uri` are not.

## Notes and Gotchas

- `GlitteryBackground.astro` is a port of the old React canvas component. It is not used by any page; it is kept deliberately. Drop it inside a `relative` container to enable it.
- `src/data/bio.md` is under `src/data/`, not `src/content/`, to stay clear of Astro's content-collections directory.
- `Experience.type` is defined in the interface and populated in the data, but not rendered. The Experience block also renders a trailing `·` separator with nothing after it — both are inherited from the Next.js version and left as-is.
- No image optimization pipeline: `avatar.jpg` is served straight from `public/` as a plain `<img>`.
- Astro's dev server is port **4321**, not 3000.
