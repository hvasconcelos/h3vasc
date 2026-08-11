import type { APIRoute } from 'astro'
import { getArticles, isoDate } from '../lib/articles'

/**
 * Hand-rolled rather than @astrojs/sitemap: the integration would pull in a
 * dependency to emit a handful of <url>s. Every Markdown twin is listed
 * alongside its page, so a crawler that follows the sitemap finds them without
 * having to parse the HTML for the alternate link.
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? ''
  const today = new Date().toISOString().slice(0, 10)
  const articles = await getArticles()

  const urls = [
    { loc: `${origin}/`, lastmod: today, priority: '1.0' },
    { loc: `${origin}/index.md`, lastmod: today, priority: '0.5' },
    // An article's own date, not the build date: the file does not change
    // every time something unrelated on the homepage does.
    ...articles.flatMap((article) => [
      {
        loc: `${origin}${article.href}`,
        lastmod: isoDate(article.date),
        priority: '0.8',
      },
      {
        loc: `${origin}${article.markdownHref}`,
        lastmod: isoDate(article.date),
        priority: '0.4',
      },
    ]),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <priority>${url.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
