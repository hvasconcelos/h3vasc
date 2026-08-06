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
│   │   ├── AudioPlayer.astro
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
├── public/                      # avatar.jpg, og.png, the icon set, site.webmanifest,
│                                #   reaxis-liquid-alchemy-loop.{ogg,mp3}
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
- **Background track** → `backgroundTrack` in `src/data/music.ts` (`Track`). Metadata for the homepage loop; see Background Music below.
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

The site serves its content as Markdown alongside the HTML, so an agent does not have to scrape tags to read it. Five static endpoints are prerendered at build time (`output: 'static'`, so these are plain files in `dist/`):

| Route | Source | Purpose |
| --- | --- | --- |
| `/index.md` | `src/pages/index.md.ts` | The whole page as Markdown |
| `/llms-full.txt` | `src/pages/llms-full.txt.ts` | The same document under the llms.txt companion name |
| `/llms.txt` | `src/pages/llms.txt.ts` | [llms.txt](https://llmstxt.org) index pointing at both |
| `/robots.txt` | `src/pages/robots.txt.ts` | Allowlist, explicitly naming AI crawlers |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Two URLs; hand-rolled to avoid a dependency |

**All three Markdown outputs are generated by `src/lib/content.ts` from the same `src/data/` modules the page renders from.** Adding a section to `index.astro` means adding it to `renderSiteMarkdown` too, or the twins silently fall behind. Never hand-write content into these endpoints — that is the one way this arrangement breaks.

`/llms-full.txt` is byte-identical to `/index.md` and stays that way: the site is one page, so "everything in one file" and "the homepage as Markdown" are the same document. Both exist because they answer to different conventions, and an agent that looks for one will not think to try the other. It is served as `text/plain`, not `text/markdown` — the built file is `.txt` and nginx types it from `mime.types` regardless, so matching that keeps dev and production from disagreeing and saves a second `types { }` block.

The bio is pulled in with `import bioMarkdown from '../data/bio.md?raw'`, so it lands in `/index.md` as its original Markdown rather than round-tripping through HTML.

`Astro.site` supplies the origin in every endpoint (via the `site` prop on `APIRoute`), so the domain is only ever written in `astro.config.mjs`.

`Layout.astro` advertises the twin with `<link rel="alternate" type="text/markdown" href="/index.md">`.

nginx needs help here: its bundled `mime.types` has no `.md` entry, so `nginx.conf.template` has a `location = /index.md` block using the documented `types { }` + `default_type` idiom to force `text/markdown`. Without it the file is served as `application/octet-stream` and clients download it instead of reading it. `/site.webmanifest` has the same gap and the same fix.

### Link headers and Accept negotiation

Two things live in `nginx.conf.template` rather than the markup, because a `<head>` is only reachable by fetching and parsing the HTML first.

**`Link` headers (RFC 8288)** surface the same three relations a `HEAD` request can see: `rel="alternate"` to the other representation, `rel="sitemap"`, and `rel="describedby"` to `/llms.txt`. Built by the `$agent_link` map, which is keyed on `$uri` and yields an empty string for anything that is not a page — `add_header` omits a header whose value is empty, so assets are untouched. Vercel gets the same headers from the `headers` block in `vercel.json`, spelled out per route because Vercel has no equivalent of a map.

**`Accept: text/markdown` on `/`** returns the Markdown twin. The `$homepage` map picks the file and `location = /` reaches it with `rewrite ^ $homepage last` — `last` re-runs location matching, which is the whole point: it lands in `location = /index.md` and picks up that block's `text/markdown` type. `try_files` would serve the file from `location = /` instead and nginx would type it from `mime.types`, which is exactly the `.md` gap above. Both representations send `Vary: Accept`.

The regex ignores q-values because nginx cannot parse them, so a client that mentions `text/markdown` at all is taken to want it. No browser does — the `Accept` Chrome and Safari send has no Markdown in it.

**This is nginx-only.** A static Vercel deployment cannot vary on a request header; it would need an edge function. Production currently serves from the Docker image, so the negotiation is live — but `/index.md`, the `<link rel="alternate">` and the `Link` header all point at the same content, so a host without it loses nothing but a shortcut.

### add_header does not merge across levels

nginx inherits `add_header` from an outer level **only when the current level declares none of its own**. One `add_header` in a `location` silently drops every server-level header for that location. Every location in `nginx.conf.template` that sets a header therefore repeats the full set — the three security headers, plus `Link`. This is easy to get wrong: adding a `Cache-Control` to a location and nothing else will quietly remove `nosniff` from it.

### Web Bot Auth is deliberately absent

AgentReady lists Web Bot Auth (RFC 9421 HTTP message signatures, via `/.well-known/http-message-signatures-directory`) as a baseline SHOULD. It is not implemented, and that is a documented deviation rather than an oversight: it exists so a server can verify which bot is calling *before deciding what to grant it*, and this site gates nothing. Every byte of it is public and `robots.txt` invites the crawlers in by name. There is no decision for a signature to inform. Add it only if some part of the site ever stops being public.

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

The photo is **desaturated and nothing else** — no contrast curve, no posterisation, no halftone. `.grayscale()` is the whole treatment, which is all the grayscale-only rule asks for. An earlier revision reduced it to two tones and ordered-dithered it; that was deliberately reverted, so do not reintroduce an effect here.

Two things about that script are load-bearing:

- **The `CROP` constant.** The source is a 1024×1024 headshot sitting in a lot of empty backdrop; scaled whole to 16px it is a grey smudge. Everything is cut from a square around the head first. Adjust `CROP` if the avatar is ever reshot — do not drop it.
- **The hand-rolled ICO.** sharp cannot write ICO, so the script packs PNGs into the container itself (6-byte header, one 16-byte directory entry per image, then the payloads verbatim). This is the format's documented post-Vista PNG mode, not a trick.

Each size is resampled straight from the source crop rather than from a shared master, so no output carries another size's resampling.

When previewing output, note that **chained `.resize()` calls in one sharp pipeline collapse to the last one** — `sharp(f).resize(16,16).resize(160,160)` renders at 160, not a magnified 16. Small-size checks need two separate pipelines.

There is deliberately **no SVG favicon** — browsers prefer `image/svg+xml` over every other `rel="icon"`, so one would silently beat the photo. The old `h` glyph at `public/favicon.svg` was removed for exactly that reason; do not reinstate it without also dropping the PNGs.

## Background Music

`AudioPlayer.astro`, in the homepage header only — 404 shares `Layout` but not that header. Track metadata is `backgroundTrack` in `src/data/music.ts`; the audio itself is `public/reaxis-liquid-alchemy-loop.{ogg,mp3}`.

### The state model — read this before touching the script

Two independent flags. Everything visible is derived from both, and **nothing reads `audio.paused` to decide what the UI shows.**

| Flag | Means | Changed by | Persisted |
| --- | --- | --- | --- |
| `intent` | the visitor wants sound | **only** a click on the toggle | yes, `localStorage['music']` |
| `unlocked` | the browser is allowing playback | `play()` resolving or rejecting | never |

`soundOn = intent && unlocked`, computed in one place (`render()`).

**The `visibilitychange` handler calls `audio.pause()` and touches neither flag.** That is exactly what makes "pause → switch tabs → return" stay paused while "playing → switch tabs → return" resumes. Collapsing these into one boolean is the bug this design exists to prevent — if you find yourself adding a third piece of state, you are probably about to reintroduce it.

### The rest of the load-bearing details

- **Autoplay is attempted, not assumed.** Browsers require a user gesture for audible playback, so `attemptPlay()` falls back to arming gesture listeners via an `AbortController`. Those listeners are dropped only once a `play()` actually **resolves** — never on the first event to arrive, or a scroll spends the one attempt on browsers that do not count scrolling as activation.
- **Muting calls `disarm()`.** Otherwise a later scroll restarts music the visitor just turned off.
- **The click handler branches on `intent && unlocked`, not `intent`.** While autoplay is blocked the button reads "play" even though intent is already true; clicking must start playback, not flip an invisible flag.
- **The `sound-on:` variant** in `global.css` drives the icon swap in pure CSS, mirroring `dark:`. Unlike `dark:` it has **no pre-paint script**, deliberately: at first paint nothing is playing whatever `localStorage` says, because the browser has not ruled on autoplay yet. "Off" is the only honest initial render.
- **`preload="none"`.** Most visitors' autoplay is refused and some never interact; eagerly fetching ~0.8 MB of audio they may never hear would compete with the fonts and the avatar for early bandwidth.
- **Opus is offered first, MP3 second.** MP3 carries encoder padding that `loop` cannot skip, so it seams audibly on every restart — on techno that reads as a dropped beat. Opus stores its pre-skip in the container and every decoder honours it. The `.ogg` extension rather than `.opus` is deliberate: nginx's `mime.types` has `audio/ogg ogg` and **no** `.opus` entry.
- **Never ship a `.mpeg` extension.** nginx maps it to `video/mpeg`, and `nginx.conf.template` already sends `X-Content-Type-Options: nosniff`, so the browser is forbidden from sniffing past the wrong type. It works in `astro dev` and fails in production — the worst failure shape there is.
- **The info panel has three independent reasons to be open** — pointer over it, focus inside it, or `stuck` (a tap held it). It closes only when none holds. Hand-rolled rather than the native `popover` attribute: a popover is promoted to the top layer, whose containing block is the viewport, so `absolute top-full right-0` cannot anchor to the button. It uses the `hidden` **attribute** rather than an opacity utility, which takes the Spotify link out of the tab order when closed.
- **`stuck` is what makes touch work, and it is not optional.** A touch pointer stops existing when the finger lifts, so the browser fires `pointerleave` immediately after `pointerup` — the hover path alone opens the panel and shuts it again in milliseconds. Focus is no backstop either: **iOS Safari does not focus a `<button>` on tap**, so the `focusin` branch never runs there. Only `pointerType === 'touch'` sticks, so mouse behaviour is untouched. Dismissed by an outside tap, Escape, or scrolling; all three go through `dismiss()` so the flag is never left set behind a hidden panel.
- **No `aria-pressed` on the play/pause button.** Its accessible name already changes between "Play background music" and "Pause background music"; adding `aria-pressed` on top produces the "paused, pressed" double-negation. Pick one mechanism, not both.

### Limits worth knowing before "fixing" them

- **OS-level muting is undetectable.** Device muted, tab muted in Chrome, or the iOS ringer switch — `play()` resolves, `unlocked` goes true, and the button reads "Pause" while nothing is audible. No API exposes this. Do not try to infer it from `AudioContext` state; the heuristics are unreliable and guessing wrong is worse.
- **`prefers-reduced-motion` does not apply to audio.** It is a motion query and there is no reduced-sound equivalent. Gating playback on it would invent a preference the visitor never expressed.

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

- `--color-terminal` (`#0f7d45` light, `#3ff08a` dark) — the blinking block caret and the background-music play/pause icon. Those two, and nothing else.
- `--color-label` (`#71716b` light, `#3ff08a` dark) — the six section labels. Green works against the dark page but turns into a lime highlighter on the warm light page, so **light deliberately keeps the muted gray**. Do not "fix" this into a single value.

The green is the only hue on the site and it stays scarce; do not extend it to links, tags or body headings. Label contrast holds either way: 4.58:1 light, 12.53:1 dark.

The play/pause icon is the one deliberate extension beyond the caret: it marks the only control on the page that makes noise, which is worth one glance of colour. It is an icon rather than text, so it answers to the 3:1 non-text contrast threshold — `#0f7d45` on the light page clears that comfortably. The theme toggle beside it deliberately stays `gray-400`; two green controls side by side would spend the scarcity for nothing.

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
