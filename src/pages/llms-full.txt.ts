import type { APIRoute } from 'astro'
import { renderLlmsFullTxt } from '../lib/content'

/**
 * llms-full.txt — the whole site in one fetch, for an agent that would rather
 * ingest everything than follow the links in /llms.txt.
 *
 * It used to be byte-identical to /index.md, back when the site was one page
 * and "everything" and "the homepage" were the same document. Self-hosted
 * articles ended that: this file is now the profile followed by every article
 * in full, which is what the convention promises, while /index.md stays the
 * Markdown twin of the page it is named after — a document that lists the
 * writing rather than containing it.
 *
 * text/plain rather than text/markdown, unlike /index.md: the built file is
 * `llms-full.txt`, and nginx serves .txt from its bundled mime.types as
 * text/plain no matter what this says. Matching it keeps dev and production
 * identical instead of quietly disagreeing, and saves a second `types { }`
 * block in nginx.conf.template.
 */
export const GET: APIRoute = async ({ site }) =>
  new Response(await renderLlmsFullTxt(site?.origin ?? ''), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
