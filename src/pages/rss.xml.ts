import type { APIRoute } from 'astro'
import { getArticles } from '../lib/articles'
import { NAME, SUMMARY } from '../lib/content'

/**
 * RSS 2.0 for the self-hosted articles. Hand-rolled for the same reason the
 * sitemap is: @astrojs/rss would be a dependency to emit a handful of <item>s.
 *
 * Self-hosted pieces only. The Writing list also carries posts on other
 * people's domains, and republishing their titles into a feed here would
 * misrepresent where they live and whose feed they belong in.
 *
 * Items carry the description rather than the body: a reader that wants the
 * whole thing has the link, and /articles/<slug>.md serves it as text.
 */

/** RFC 822, as RSS requires — not the ISO 8601 the rest of the site uses. */
const rfc822 = (date: Date) => date.toUTCString()

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? ''
  const articles = await getArticles()
  const latest = articles[0]?.date

  const items = articles.map((article) => {
    const url = `${origin}${article.href}`
    return [
      '    <item>',
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(article.date)}</pubDate>`,
      `      <description>${escapeXml(article.description)}</description>`,
      ...article.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      '    </item>',
    ].join('\n')
  })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(NAME)}</title>
    <link>${origin}/</link>
    <description>${escapeXml(SUMMARY)}</description>
    <language>en-gb</language>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
