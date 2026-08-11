import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
// `astro/zod` rather than `astro:content` — the latter's re-export is
// deprecated and on its way out.
import { z } from 'astro/zod'

/**
 * Self-hosted writing. The Markdown lives in `articles/` at the repository
 * root rather than under `src/` — that is where the pieces get written, and the
 * glob loader's `base` is happy to reach outside `src/`.
 *
 * Everything about a file's identity beyond its frontmatter — the slug, the
 * ordering, the URL — is decided in `src/lib/articles.ts`, so nothing else has
 * to know how these files are named.
 */
const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './articles' }),
  schema: z.object({
    title: z.string(),
    // Frontmatter dates parse as Date already; coerce covers a quoted string.
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    /** Overrides the slug derived from the filename. Rarely needed. */
    slug: z.string().optional(),
  }),
})

export const collections = { articles }
