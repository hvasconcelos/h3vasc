import type { APIRoute } from 'astro'

/**
 * Crawlers that respect robots.txt but ignore `User-agent: *` for AI training
 * and retrieval — Google-Extended and Applebot-Extended in particular only
 * read a block naming them. Listing them explicitly is the whole point here:
 * the site opts *in* to being read by agents rather than staying silent.
 */
const AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'CCBot',
]

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? ''

  const body = [
    `# Full content as Markdown: ${origin}/index.md`,
    `# Index for agents:         ${origin}/llms.txt`,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
