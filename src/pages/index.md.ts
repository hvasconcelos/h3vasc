import type { APIRoute } from 'astro'
import { renderSiteMarkdown } from '../lib/content'

/**
 * The Markdown twin of the homepage, at /index.md. Agents and LLM clients that
 * would otherwise strip tags off the HTML can read this instead, and the site
 * links to it from <link rel="alternate" type="text/markdown">.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(renderSiteMarkdown(site?.origin ?? ''), {
    headers: {
      // charset is explicit: the content carries accented characters.
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
