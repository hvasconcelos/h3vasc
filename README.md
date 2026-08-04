# Helder Vasconcelos — Personal Website

A minimal, grayscale personal site built with Astro, Vite, TypeScript and Tailwind CSS. Output is fully static: plain HTML, CSS and a few hundred bytes of JS.

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:4321>.

## Scripts

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Dev server with HMR at `localhost:4321`             |
| `npm run build`   | Static production build into `dist/`                |
| `npm run preview` | Serve the contents of `dist/` locally               |
| `npm run check`   | Type-check `.astro` and `.ts` files (`astro check`) |

## Project layout

```
h3vasc-web/
├── src/
│   ├── pages/
│   │   ├── index.astro          # The whole site
│   │   └── 404.astro
│   ├── layouts/
│   │   └── Layout.astro         # <head>, fonts, metadata
│   ├── components/
│   │   ├── CollapsibleSection.astro
│   │   ├── SocialIcon.astro
│   │   ├── ThemeToggle.astro
│   │   └── GlitteryBackground.astro   # animated canvas, currently unused
│   ├── data/                    # All site content
│   │   ├── bio.md               # About section (Markdown)
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── writing.ts
│   │   └── social.ts
│   └── styles/
│       └── global.css           # Tailwind entry + theme
├── public/                      # Copied verbatim into dist/
│   ├── avatar.jpg
│   └── favicon.svg
├── astro.config.mjs
├── Dockerfile
└── nginx.conf.template
```

## Editing content

Content is separated from markup — you rarely need to touch `.astro` files.

**Bio** — edit `src/data/bio.md`. Standard Markdown; links automatically open in a new tab.

**Experience, side projects, education, writing, social links** — edit the matching file in `src/data/`. Each exports a typed array, so a missing or misspelled field is a build error rather than a broken page:

```typescript
// src/data/writing.ts
export const blogPosts: BlogPost[] = [
  {
    title: 'Your Blog Post Title',
    date: 'LayerX Blog, 2025',
    url: 'https://your-blog-url.com',
  },
]
```

**Sections** — each section on the page is a `<CollapsibleSection>` in `src/pages/index.astro`. Pass `defaultOpen` to have one start expanded:

```astro
<CollapsibleSection id="about" title="About" defaultOpen>
```

They are built on native `<details>`/`<summary>`, so they still expand with JavaScript disabled; the height animation is the only part that needs JS, and it is skipped under `prefers-reduced-motion`.

## Theming

The site ships light and dark themes, switched by the button in the header. Until you click it the site follows your OS setting; after that your choice is remembered in `localStorage`. An inline script in `<head>` applies the theme before the first paint, so there is no flash of the wrong colours.

The dark theme is the grayscale palette reversed — `:root[data-theme='dark']` in `src/styles/global.css` reassigns `--color-gray-50` … `--color-gray-900`. Adding a component needs no dark-mode work as long as it uses the `gray-*` scale.

## Docker

Build the image and run it anywhere a container runs:

```bash
docker build -t h3vasc-web .
docker run --rm -p 8080:8080 h3vasc-web
```

Open <http://localhost:8080>.

The image is a two-stage build — Node compiles the site, then nginx (Alpine) serves `dist/`. Nothing from the build stage ships in the final image.

`PORT` is overridable for hosts that assign one:

```bash
docker run --rm -e PORT=3000 -p 3000:3000 h3vasc-web
```

## Deploying

**Vercel** — `vercel.json` already points at the `dist/` output directory. Push to the connected repository, or run `vercel` from the project root.

**Any static host** — run `npm run build` and upload `dist/`. There is no server-side runtime.

**Any container host** — build the Dockerfile. It listens on `$PORT` (default `8080`) and has a healthcheck, which covers Cloud Run, Fly.io, Railway, ECS and friends.

## Tech stack

- [Astro](https://astro.build) 7 (Vite under the hood)
- TypeScript (strict)
- Tailwind CSS 4, configured in CSS via `@theme`
- Inter + JetBrains Mono, self-hosted through Fontsource
