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
hvasc-web/
├── src/
│   ├── pages/
│   │   ├── index.astro          # The entire site
│   │   ├── 404.astro
│   │   ├── index.md.ts          # /index.md — the Markdown twin
│   │   ├── llms.txt.ts          # /llms.txt — index for agents
│   │   ├── robots.txt.ts        # /robots.txt
│   │   └── sitemap.xml.ts       # /sitemap.xml
│   ├── layouts/
│   │   └── Layout.astro         # <head>, font imports, metadata, JSON-LD
│   ├── components/
│   │   ├── CollapsibleSection.astro
│   │   ├── SocialIcon.astro
│   │   ├── ThemeToggle.astro
│   │   └── GlitteryBackground.astro
│   ├── data/                    # Content lives here, not in markup
│   │   ├── bio.md
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── writing.ts
│   │   ├── music.ts
│   │   └── social.ts
│   ├── lib/
│   │   └── content.ts           # Renders src/data as Markdown
│   └── styles/
│       └── global.css
├── public/                      # avatar.jpg, og.png, the icon set, site.webmanifest
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
npm run og        # regenerate public/og.png       (committed, not part of the build)
npm run icons     # regenerate the favicon set     (committed, not part of the build)
```

There is no lint script. `npm run check` is the closest equivalent and should pass before committing.

## Content Updates

**Always prefer editing `src/data/` over editing markup.** Every section is driven by a typed array or a Markdown file.

- **Bio** → `src/data/bio.md`. Plain Markdown. External links get `target="_blank"` automatically (see the `externalLinks` hast plugin in `astro.config.mjs`) — do not hand-write `target` attributes.
- **Experience** → `src/data/experience.ts` (`Experience[]`)
- **Side projects** → `src/data/projects.ts` (`Project[]`). Names and descriptions are copied verbatim from GitHub; refresh them with `gh api repos/<owner>/<repo>` rather than paraphrasing. Deliberately no star counts — they would go stale in a static build.
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
- Currently **About** starts open (`defaultOpen`); Experience, Side Projects, Education and Writing start collapsed.

## Design Principles

- **Minimal & clean**: white background, grayscale palette only
- **Typography**: JetBrains Mono throughout. `--font-sans` and `--font-mono` both resolve to it, so existing `font-mono` utilities still read as intent without changing the rendering. Inter remains a dependency but is **not** imported by `Layout.astro`, so it never ships — re-add that import if the site ever moves off an all-mono setting.
- **Responsive**: content column capped at `max-w-2xl`
- **Accessibility**: `aria-label` on icon links, decorative glyphs marked `aria-hidden`

## Agent-Readable Surface

The site serves its content as Markdown alongside the HTML, so an agent does not have to scrape tags to read it. Four static endpoints are prerendered at build time (`output: 'static'`, so these are plain files in `dist/`):

| Route | Source | Purpose |
| --- | --- | --- |
| `/index.md` | `src/pages/index.md.ts` | The whole page as Markdown |
| `/llms.txt` | `src/pages/llms.txt.ts` | [llms.txt](https://llmstxt.org) index pointing at `/index.md` |
| `/robots.txt` | `src/pages/robots.txt.ts` | Allowlist, explicitly naming AI crawlers |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Two URLs; hand-rolled to avoid a dependency |

**Both Markdown outputs are generated by `src/lib/content.ts` from the same `src/data/` modules the page renders from.** Adding a section to `index.astro` means adding it to `renderSiteMarkdown` too, or the twin silently falls behind. Never hand-write content into these endpoints — that is the one way this arrangement breaks.

The bio is pulled in with `import bioMarkdown from '../data/bio.md?raw'`, so it lands in `/index.md` as its original Markdown rather than round-tripping through HTML.

`Astro.site` supplies the origin in every endpoint (via the `site` prop on `APIRoute`), so the domain is only ever written in `astro.config.mjs`.

`Layout.astro` advertises the twin with `<link rel="alternate" type="text/markdown" href="/index.md">`.

nginx needs help here: its bundled `mime.types` has no `.md` entry, so `nginx.conf.template` has a `location = /index.md` block using the documented `types { }` + `default_type` idiom to force `text/markdown`. Without it the file is served as `application/octet-stream` and clients download it instead of reading it. `/site.webmanifest` has the same gap and the same fix.

## Social Cards

`Layout.astro` emits the Open Graph, Twitter and JSON-LD metadata. `og:image` defaults to `/og.png` and can be overridden per page with the layout's `image` prop.

The JSON-LD is a `@graph` of four nodes — `ProfilePage`, `WebSite`, `Person` and the `Book` — cross-referenced by `@id` rather than nested. Keeping them as separate nodes is what lets a consumer distinguish "this page is *about* him" from "he *wrote* this"; flattening it back into a single `Person` loses that. `personId` is the stable anchor every other node points at, so it must not change.

`public/og.png` is generated by `scripts/generate-og.mjs` (`npm run og`) and **committed** — it is not produced during `astro build`, so regenerate and commit it after changing the avatar or the strings in that script. The script rasterises an SVG with sharp, which resolves fonts through the system rather than the site's webfonts, so the families it references must be ones macOS ships (Inter Display, Menlo). Do not switch it to JetBrains Mono: that font is only present as a webfont here.

## Favicons and App Icons

Every icon is cut from `public/avatar.jpg` by `scripts/generate-icons.mjs` (`npm run icons`). Like `og.png`, the outputs are **committed** and not produced during `astro build`, so regenerate and commit them after changing the avatar.

| File | Size | Used by |
| --- | --- | --- |
| `favicon.ico` | 16, 32, 48 | legacy clients, Windows shortcuts |
| `favicon-96x96.png` | 96 | browser tabs |
| `apple-touch-icon.png` | 180 | iOS home screen |
| `icon-192.png`, `icon-512.png` | 192, 512 | Android home screen, install prompt, via `site.webmanifest` |

Three things about that script are load-bearing:

- **The `CROP` constant.** The source is a 1024×1024 headshot sitting in a lot of empty backdrop; scaled whole to 16px it is a grey smudge. Every output is cut from a square around the head first. Adjust `CROP` if the avatar is ever reshot — do not drop it.
- **The hand-rolled ICO.** sharp cannot write ICO, so the script packs PNGs into the container itself (6-byte header, one 16-byte directory entry per image, then the payloads verbatim). This is the format's documented post-Vista PNG mode, not a trick.
- **`flatten()` on the touch icon.** iOS backs a transparent icon with black. Everything is rendered opaque over the dark page colour.

There is deliberately **no SVG favicon** — browsers prefer `image/svg+xml` over every other `rel="icon"`, so one would silently beat the photo. The old `h` glyph at `public/favicon.svg` was removed for exactly that reason; do not reinstate it without also dropping the PNGs.

## Theming

Light and dark, toggled by `ThemeToggle.astro` in the header.

- The active theme is a `data-theme="light" | "dark"` attribute on `<html>`.
- **Dark is the default.** `<html>` ships with `data-theme="dark"` already set, so dark holds even with JavaScript disabled. The OS `prefers-color-scheme` is deliberately **not** consulted — a visitor on a light system still lands on dark.
- An **inline** `is:inline` script in `Layout.astro` flips it to light only when `localStorage.theme === 'light'`. It must stay inline and unbundled — a deferred script paints the wrong theme first.
- Clicking the toggle writes to `localStorage` and pins the choice from then on.
- **The dark theme is the light palette read backwards.** `:root[data-theme='dark']` in `global.css` reassigns `--color-gray-50` through `--color-gray-900` to the reversed scale, plus `--color-page`. Every Tailwind utility resolves through `var(--color-gray-*)`, so this themes the entire site with no `dark:` classes in the markup. It works only because the design uses the scale directionally (dark text on a light page) — **keep it that way**: a new component should reach for `text-gray-900` for primary text and `text-gray-400` for muted, never a hardcoded hex or an off-scale color.
- A `dark:` variant is available (`@custom-variant` in `global.css`) for the rare case that needs it — currently only the toggle's own sun/moon icon swap.

### Accent

`--color-accent` marks the shell prompt, prose links and section chevrons. It is a **brightness step, not a hue** — the strongest end of the ramp (`#26251e` light, `#edecec` dark). Bracketed tags deliberately use `text-gray-500` instead, so the 37 of them recede rather than compete with the prompt.

Two tokens carry the terminal green, and they are **theme-asymmetric on purpose**:

- `--color-terminal` (`#0f7d45` light, `#3ff08a` dark) — the blinking block caret only.
- `--color-label` (`#71716b` light, `#3ff08a` dark) — the six section labels. Green works against the dark page but turns into a lime highlighter on the warm light page, so **light deliberately keeps the muted gray**. Do not "fix" this into a single value.

The green is the only hue on the site and it stays scarce; do not extend it to links, tags or body headings. Label contrast holds either way: 4.58:1 light, 12.53:1 dark.

### Color Palette

Defined in `src/styles/global.css` under `@theme` (Tailwind 4 is configured in CSS — there is no `tailwind.config.ts`).

The ramp is **Cursor's**, not Tailwind's neutrals: page and foreground are Cursor's `--color-theme-bg` / `--color-theme-fg` (`#f7f7f4` / `#26251e` light, `#14120b` / `#edecec` dark), and the steps between are Cursor's own alpha ladder composited over the page, which keeps the warm olive cast through the whole scale. It is a warm neutral — **not** a true gray — so never mix in a Tailwind default gray or a hardcoded `#ccc`; it will read as a cold patch.

Alphas at steps 400–700 are raised above Cursor's own so every step carrying real text clears 4.5:1. `gray-400` is the exception at 3.24:1 on light and is reserved for decoration (footer line, toggle border) — do not put body text on it.

- Page: `--color-page`
- Primary text: `gray-900`
- Body text: `gray-700`
- Descriptions: `gray-600`
- Metadata and section labels: `gray-500`
- Borders: `gray-200`

Use `gray-*` utilities and nothing else.

## Deployment

**Vercel** — `vercel.json` sets `outputDirectory: dist`. Static export, no server runtime.

**Docker** — two-stage build (`node:22-alpine` → `nginx:1.29-alpine`):

```bash
docker build -t hvasc-web .
docker run --rm -p 8080:8080 hvasc-web
```

nginx config lives in `nginx.conf.template` and is rendered by the official image's envsubst entrypoint at startup, so `PORT` is overridable. If you edit that file, remember `${PORT}` is substituted but nginx runtime variables like `$uri` are not.

## Notes and Gotchas

- `GlitteryBackground.astro` is a port of the old React canvas component. It is not used by any page; it is kept deliberately. Drop it inside a `relative` container to enable it.
- `src/data/bio.md` is under `src/data/`, not `src/content/`, to stay clear of Astro's content-collections directory.
- `Experience.type` is defined in the interface and populated in the data, but not rendered. The Experience block also renders a trailing `·` separator with nothing after it — both are inherited from the Next.js version and left as-is.
- No image optimization pipeline: `avatar.jpg` is served straight from `public/` as a plain `<img>`.
- Astro's dev server is port **4321**, not 3000.
