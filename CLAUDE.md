# Helder Vasconcelos Personal Website

## Project Overview

Minimal, grayscale personal website for Helder Vasconcelos, CTO at LayerX. One page plus a self-hosted article per file in `articles/`; a static site built with Astro and deployed to Vercel, or as a container via the included Dockerfile.

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
├── articles/                    # Self-hosted writing, one Markdown file each
│   └── YYYYMMDD_some_title.md
├── src/
│   ├── pages/
│   │   ├── index.astro          # The homepage — every section of it
│   │   ├── 404.astro
│   │   ├── articles/
│   │   │   ├── [slug].astro     # /articles/<slug> — one article
│   │   │   └── [slug].md.ts     # /articles/<slug>.md — its Markdown twin
│   │   ├── index.md.ts          # /index.md — the homepage's Markdown twin
│   │   ├── llms.txt.ts          # /llms.txt — index for agents
│   │   ├── llms-full.txt.ts     # /llms-full.txt — profile + every article
│   │   ├── rss.xml.ts           # /rss.xml — feed, self-hosted articles only
│   │   ├── robots.txt.ts        # /robots.txt
│   │   └── sitemap.xml.ts       # /sitemap.xml
│   ├── layouts/
│   │   └── Layout.astro         # <head>, font imports, metadata, JSON-LD
│   ├── components/
│   │   ├── CollapsibleSection.astro
│   │   ├── SocialIcon.astro
│   │   ├── ThemeToggle.astro
│   │   └── GlitteryBackground.astro
│   ├── content.config.ts        # The `articles` collection, loaded from ../articles
│   ├── data/                    # Content lives here, not in markup
│   │   ├── bio.md
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── writing.ts
│   │   ├── music.ts
│   │   └── social.ts
│   ├── lib/
│   │   ├── articles.ts          # Slugs, ordering, article Markdown, the Writing merge
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
- **Writing** → `src/data/writing.ts` (`BlogPost[]`) for posts published on *other* people's domains. Self-hosted pieces are files in `articles/` and are never listed here by hand — see Articles below.
- **Music** → `src/data/music.ts` (`MusicProject[]`). Discography, from Discogs. Read-only credits: there is no player on the site and no audio in `public/`.
- **Social links** → `src/data/social.ts` (`SocialLink[]`). The `platform` field selects an SVG in `SocialIcon.astro`; adding a new platform means widening the `SocialPlatform` union and adding a branch there.

## Articles

Self-hosted writing. One Markdown file per piece in **`articles/`**, at the repository root rather than under `src/` — that is where the pieces get written, and the glob loader's `base` is happy to reach outside `src/`. Publishing is: add the file, commit, deploy. Nothing else is edited.

Frontmatter is validated by the `articles` collection in `src/content.config.ts`:

```yaml
---
title: "The AGI Race Has Two Scoreboards. You Only Need One."
date: 2026-08-11
description: "One sentence. It becomes the meta description, the RSS item and the llms.txt entry."
tags: [ai, llm, inference]
---
```

`title`, `date` and `description` are required; `tags` defaults to empty. A `slug` field is accepted and overrides the derived one, but is rarely needed.

**Filenames are `YYYYMMDD_words_here.md`.** The date prefix sorts the folder chronologically on disk and is stripped from the URL; underscores become hyphens. So `20260811_agi_two_scoreboards.md` is served at `/articles/agi-two-scoreboards`.

### src/lib/articles.ts is the only thing that knows these rules

Slug derivation, ordering, the URLs, the standalone Markdown rendering and the merge into the Writing list all live there. The page, the `.md` twin, the feed, the sitemap and `/index.md` every one of them come through it, which is what keeps them from disagreeing. Two functions carry most of that weight:

- `getArticles()` — every article, newest first, each with `slug`, `href` and `markdownHref`.
- `writingEntries()` — self-hosted articles mapped into the existing `BlogPost` shape and prepended to `src/data/writing.ts`. It is `async`, so `index.astro` and `src/lib/content.ts` both `await` it. **Adding a self-hosted post to `writing.ts` by hand would double it up** — that list is for other people's domains only.

Self-hosted entries reuse the external `date` field, which is a "where, and when" label rather than a date: `hvasc.dev, 2026`. The real date is on the article page.

### The article page

`src/pages/articles/[slug].astro`, one `getStaticPaths` entry per file, rendered through the same Sätteri processor as the bio — so outbound links get `target="_blank"` from the `externalLinks` plugin here too, without any markup saying so.

The column is `max-w-3xl`, one step wider than the `max-w-2xl` every other page uses. That narrower column is sized for a stack of short blocks; a long article at the same width is a very tall thin ribbon.

Body copy is the `prose` utility in `global.css` — a plain CSS block over `p`, `h2`/`h3`, lists, `code`, `blockquote`, tables and links. It reaches only for `--color-gray-*` and `--color-accent`, so it themes with everything else and needs no `dark:`. The bio keeps its own inline `[&_a]:…` chain — it has a justify/hyphens treatment this does not.

Headings carry their weight typographically: one size step (`--text-lg`, 17px, added to the scale for exactly this), weight 600, and a 3rem gap above against 0.875rem below — a heading belongs to what follows it. An earlier revision prefixed them with `## ` from a `::before`. It read as unrendered Markdown, and generated content lands inside a selection, so copying a heading took the hashes with it. **Do not reinstate it.**

### Charts are inline SVG, not images

A scoreboard in an article is a `<figure class="scoreboard">` holding a hand-written `<svg>`, straight in the Markdown. The styling lives in the `scoreboard` utility in `global.css`, keyed on `sb-title` / `sb-source` / `sb-rule` / `sb-label` / `sb-tag` / `sb-track` / `sb-bar` / `sb-value`, so the figure in the source is geometry only.

Inline rather than an `<img>` because every fill resolves through `var(--color-gray-*)` and therefore follows the theme toggle. An external SVG cannot: it gets no access to the document's custom properties, and the site's theme is a `data-theme` attribute rather than `prefers-color-scheme`, so the media-query trick inside the file doesn't reach it either.

Conventions worth keeping: a `640`-wide `viewBox` with 26px rows, labels at `x=0`, the bar track from 208 to 580, values right-aligned at 640. Open-weight models get a `[open]` tag in the site's bracketed idiom rather than a second bar colour. The track behind each bar is what stops a four-cent bar reading as a rendering failure. `role="img"` plus an `aria-label` that states the ranking in words, because a screen reader gets nothing from the bars, and a `<figcaption>` naming the source and its date — the numbers go stale and the caption is what dates them.

The SVG scrolls rather than shrinks below `34rem` (`overflow-x: auto` on the figure, `min-width` on the svg). Scaled to phone width, an 11px label would render at about 5px.

The cost is roughly 120 lines of SVG in the article source, which also lands in the Markdown twin. That is the accepted trade for a chart that themes.

`Layout.astro` takes two optional props for this: `markdown` (which twin `rel="alternate"` points at) and `article` (`{ date, tags }`), which switches `og:type` to `article`, swaps the `profile:*` tags for `article:*`, and replaces the ProfilePage graph with a `BlogPosting`. The author there is a compact `Person` rather than a bare `@id` reference — the full node lives on the homepage, and a consumer parsing one article page cannot resolve an `@id` it has never seen. Same `personId` either way, so they are the same entity to anything that reads both.

### build.format is 'file', and the canonical depends on it

`astro.config.mjs` sets `build: { format: 'file' }`, so an article is `dist/articles/<slug>.html` with its twin at `dist/articles/<slug>.md` beside it, and the URL has no trailing slash. The directory format would produce `<slug>/index.html`, whose `$uri` at the edge is `/articles/<slug>/index.html` — every nginx rule below would have to match that instead.

The cost is that `Astro.url.pathname` carries the `.html` at build time, so **`Layout.astro` strips it before building the canonical URL**. Without that the homepage canonicalises to `/index.html`. In `astro dev` the pathname is already extensionless and the strip is a no-op, which is exactly why it is easy to break without noticing — check `dist/index.html`, not the dev server.

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
- **Responsive**: content column capped at `max-w-2xl`, except an article page, which is `max-w-3xl` — see Articles
- **Accessibility**: `aria-label` on icon links, decorative glyphs marked `aria-hidden`

## Agent-Readable Surface

The site serves its content as Markdown alongside the HTML, so an agent does not have to scrape tags to read it. Every endpoint below is prerendered at build time (`output: 'static'`, so these are plain files in `dist/`):

| Route | Source | Purpose |
| --- | --- | --- |
| `/index.md` | `src/pages/index.md.ts` | The homepage as Markdown |
| `/articles/<slug>.md` | `src/pages/articles/[slug].md.ts` | One article as Markdown, one file per article |
| `/llms-full.txt` | `src/pages/llms-full.txt.ts` | The homepage document plus every article in full |
| `/llms.txt` | `src/pages/llms.txt.ts` | [llms.txt](https://llmstxt.org) index pointing at all of them |
| `/rss.xml` | `src/pages/rss.xml.ts` | Feed; self-hosted articles only |
| `/robots.txt` | `src/pages/robots.txt.ts` | Allowlist, explicitly naming AI crawlers |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Page and twin per article; hand-rolled to avoid a dependency |

**The homepage's Markdown outputs are generated by `src/lib/content.ts` from the same `src/data/` modules the page renders from, and the articles by `src/lib/articles.ts` from the same files the pages render from.** Adding a section to `index.astro` means adding it to `renderSiteMarkdown` too, or the twins silently fall behind. Never hand-write content into these endpoints — that is the one way this arrangement breaks.

`/llms-full.txt` **used to be byte-identical to `/index.md`**, back when the site was one page and "everything in one file" and "the homepage as Markdown" were the same document. Self-hosted articles ended that. It is now the homepage document, a `---`, and every article in full — which is what the convention promises, and what keeps an agent from having to follow a link per article. `/index.md` stays the twin of the page it is named after: a document that *lists* the writing rather than containing it. The shared half is the same `renderSiteMarkdown` call, so the two can still only disagree by way of the data.

`/llms-full.txt` is served as `text/plain`, not `text/markdown` — the built file is `.txt` and nginx types it from `mime.types` regardless, so matching that keeps dev and production from disagreeing and saves a second `types { }` block.

The bio is pulled in with `import bioMarkdown from '../data/bio.md?raw'`, and an article's Markdown is `entry.body` from the content collection, so both land in the twins as their original Markdown rather than round-tripping through HTML.

`Astro.site` supplies the origin in every endpoint (via the `site` prop on `APIRoute`), so the domain is only ever written in `astro.config.mjs`.

`Layout.astro` advertises the twin with `<link rel="alternate" type="text/markdown">`, pointing at `/index.md` by default and at the article's own `.md` on an article page (the `markdown` prop). It also advertises `/rss.xml` on every page.

The feed is **self-hosted articles only**. The Writing list also carries posts on other people's domains, and republishing their titles into a feed here would misrepresent where they live and whose feed they belong in.

nginx needs help here: its bundled `mime.types` has no `.md` entry, so `nginx.conf.template` types the Markdown itself with the documented `types { }` + `default_type` idiom — `location = /index.md` for the homepage's twin and `location ~ ^/articles/[^/]+\.md$` for the articles'. Without it the file is served as `application/octet-stream` and clients download it instead of reading it. `/site.webmanifest` has the same gap and the same fix; `/rss.xml` gets a block too, so it is `application/rss+xml` rather than the `text/xml` `mime.types` would give it.

### Link headers and Accept negotiation

Two things live in `nginx.conf.template` rather than the markup, because a `<head>` is only reachable by fetching and parsing the HTML first.

**`Link` headers (RFC 8288)** surface the relations a `HEAD` request can see: `rel="alternate"` to the other representation, `rel="sitemap"`, `rel="describedby"` to `/llms.txt`, and on pages `rel="alternate"` to the feed. Built by the `$agent_link` map, which is keyed on `$uri` and yields an empty string for anything that is not a page — `add_header` omits a header whose value is empty, so assets are untouched. Vercel gets the same headers from the `headers` block in `vercel.json`, spelled out per route because Vercel has no equivalent of a map.

**Articles are deliberately not in that map.** Their alternate is *their own* twin rather than `/index.md`, so the value needs the slug — and a map's value is expanded lazily, at `add_header` time, long after location matching has run its own regexes over the same request. Rather than reason about whose captures `$1` refers to by then, the two article locations build the header inline: the page location from `$uri` (the twin is one suffix away), the `.md` location from `(?<article_slug>…)`, a **named capture on the location itself**, which nginx turns into a request-scoped variable. Both are unambiguous in a way a positional capture across two regexes is not.

**`Accept: text/markdown` on `/`** returns the Markdown twin. The `$homepage` map picks the file and `location = /` reaches it with `rewrite ^ $homepage last` — `last` re-runs location matching, which is the whole point: it lands in `location = /index.md` and picks up that block's `text/markdown` type. `try_files` would serve the file from `location = /` instead and nginx would type it from `mime.types`, which is exactly the `.md` gap above. Both representations send `Vary: Accept`.

**Articles negotiate the same way**, but there is one page per file, so no map can name the target. The `$md_suffix` map yields `.md` or nothing, and `location ~ ^/articles/[^/.]+$` appends it: `if ($md_suffix) { rewrite ^ $uri$md_suffix last; }`. `if` is safe here — `rewrite` is one of the two directives that behave inside it — and the suffix is empty for every non-agent request, so the common path falls straight through to `try_files`. The rewrite target matches the `.md` location, a different one, so there is no loop.

The regex ignores q-values because nginx cannot parse them, so a client that mentions `text/markdown` at all is taken to want it. No browser does — the `Accept` Chrome and Safari send has no Markdown in it.

**This is nginx-only.** A static Vercel deployment cannot vary on a request header; it would need an edge function. Production currently serves from the Docker image, so the negotiation is live — but the `.md` routes, the `<link rel="alternate">` and the `Link` header all point at the same content, so a host without it loses nothing but a shortcut.

The article `Link` headers in `vercel.json` interpolate `:slug` from the `source` pattern into the header value. That is documented behaviour but **has never been exercised on a real Vercel deployment here** — if the site ever moves back, check it with `curl -I` and fall back to a static value naming only the sitemap, `/llms.txt` and the feed if it does not hold.

### add_header does not merge across levels

nginx inherits `add_header` from an outer level **only when the current level declares none of its own**. One `add_header` in a `location` silently drops every server-level header for that location. Every location in `nginx.conf.template` that sets a header therefore repeats the full set — the three security headers, plus `Link`. This is easy to get wrong: adding a `Cache-Control` to a location and nothing else will quietly remove `nosniff` from it. The two locations that set no headers at all (`/site.webmanifest`, `/rss.xml`) are correct precisely because they declare none and inherit everything.

### Web Bot Auth is deliberately absent

AgentReady lists Web Bot Auth (RFC 9421 HTTP message signatures, via `/.well-known/http-message-signatures-directory`) as a baseline SHOULD. It is not implemented, and that is a documented deviation rather than an oversight: it exists so a server can verify which bot is calling *before deciding what to grant it*, and this site gates nothing. Every byte of it is public and `robots.txt` invites the crawlers in by name. There is no decision for a signature to inform. Add it only if some part of the site ever stops being public.

## Social Cards

`Layout.astro` emits the Open Graph, Twitter and JSON-LD metadata. `og:image` defaults to `/og.png` and can be overridden per page with the layout's `image` prop. Articles do not override it — there is no per-article card generator, and one would have to be a build step rather than the committed-artifact arrangement `npm run og` uses.

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

The photo is **desaturated and nothing else** — no contrast curve, no posterisation, no halftone. `.grayscale()` is the whole treatment, which is all the grayscale-only rule asks for. An earlier revision reduced it to two tones and ordered-dithered it; that was deliberately reverted, so do not reintroduce an effect here.

Two things about that script are load-bearing:

- **The `CROP` constant.** The source is a 1024×1024 headshot sitting in a lot of empty backdrop; scaled whole to 16px it is a grey smudge. Everything is cut from a square around the head first. Adjust `CROP` if the avatar is ever reshot — do not drop it.
- **The hand-rolled ICO.** sharp cannot write ICO, so the script packs PNGs into the container itself (6-byte header, one 16-byte directory entry per image, then the payloads verbatim). This is the format's documented post-Vista PNG mode, not a trick.

Each size is resampled straight from the source crop rather than from a shared master, so no output carries another size's resampling.

When previewing output, note that **chained `.resize()` calls in one sharp pipeline collapse to the last one** — `sharp(f).resize(16,16).resize(160,160)` renders at 160, not a magnified 16. Small-size checks need two separate pipelines.

There is deliberately **no SVG favicon** — browsers prefer `image/svg+xml` over every other `rel="icon"`, so one would silently beat the photo. The old `h` glyph at `public/favicon.svg` was removed for exactly that reason; do not reinstate it without also dropping the PNGs.

## Analytics

Umami, emitted by `Layout.astro`. Cookieless, so there is nothing to put behind a consent banner and none is added.

Configured by two environment variables, typed in `src/env.d.ts`:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_UMAMI_WEBSITE_ID` | The site's Umami ID. **Unset means the script tag is not emitted at all.** |
| `PUBLIC_UMAMI_SRC` | Script origin; defaults to Umami Cloud. Only needed when self-hosting. |

Four things to keep in mind:

- **Keep it environment-driven, not hardcoded.** The absent-by-default behaviour is the point: `npm run dev` sends nothing, and since the repo is MIT and the footer invites forking, a fork that has not set its own ID must not report into this site's dashboard.
- **`PUBLIC_*` is inlined at build time**, not read at runtime. `docker run -e` is too late — the Dockerfile takes `ARG PUBLIC_UMAMI_WEBSITE_ID` / `ARG PUBLIC_UMAMI_SRC` in the build stage for this reason.
- **The src fallback uses `||`, not `??`.** An unset Docker `ARG` forwarded through `ENV` arrives as an empty string rather than `undefined`, and `??` would accept it and emit `src=""`.
- **The tag is `is:inline`.** It must stay the exact tag Umami serves, loaded from their origin — letting Astro bundle it would fold a third-party script into the site's own JS.

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

- `--color-terminal` (`#0f7d45` light, `#3ff08a` dark) — the blinking block caret. That, and nothing else.
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

**hvasc.dev today serves from the Docker image, behind Cloudflare** — the origin answers with `x-railway-edge`, and the response headers are the ones in `nginx.conf.template`. So that file, not `vercel.json`, is the live edge config; check changes there against the container before assuming they shipped.

**Vercel** — `vercel.json` sets `outputDirectory: dist`, plus a `headers` block mirroring the `Link` headers nginx builds from `$agent_link`. Static export, no server runtime; the `Accept` negotiation on `/` does not survive here.

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
