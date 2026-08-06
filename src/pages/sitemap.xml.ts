import type { APIRoute } from 'astro'

/**
 * Hand-rolled rather than @astrojs/sitemap: the site is a single page, and the
 * integration would pull in a dependency to emit one <url>. The Markdown twin
 * is listed too, so a crawler that follows the sitemap finds it without having
 * to parse the HTML for the alternate link.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? ''
  const lastmod = new Date().toISOString().slice(0, 10)

  const urls = [
    { loc: `${origin}/`, priority: '1.0' },
    { loc: `${origin}/index.md`, priority: '0.5' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${url.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
