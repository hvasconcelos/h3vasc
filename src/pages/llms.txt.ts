import type { APIRoute } from 'astro'
import { renderLlmsTxt } from '../lib/content'

/** https://llmstxt.org — an index for agents, pointing at /index.md. */
export const GET: APIRoute = async ({ site }) =>
  new Response(await renderLlmsTxt(site?.origin ?? ''), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
