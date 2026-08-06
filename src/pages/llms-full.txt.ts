import type { APIRoute } from 'astro'
import { renderSiteMarkdown } from '../lib/content'

/**
 * llms-full.txt — the whole site in one fetch, for an agent that would rather
 * ingest everything than follow the links in /llms.txt.
 *
 * Byte-identical to /index.md, and deliberately so: the site is a single page,
 * so "the full content" and "the homepage as Markdown" are the same document.
 * Both exist because they answer to different conventions — /index.md is the
 * Markdown twin advertised by <link rel="alternate">, this is the llms.txt
 * companion file — and an agent looking for one will not think to try the
 * other. Rendering both from renderSiteMarkdown is what keeps that free.
 *
 * text/plain rather than text/markdown, unlike /index.md: the built file is
 * `llms-full.txt`, and nginx serves .txt from its bundled mime.types as
 * text/plain no matter what this says. Matching it keeps dev and production
 * identical instead of quietly disagreeing, and saves a second `types { }`
 * block in nginx.conf.template.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(renderSiteMarkdown(site?.origin ?? ''), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
