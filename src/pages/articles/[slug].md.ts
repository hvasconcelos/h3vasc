import type { APIRoute, GetStaticPaths } from 'astro'
import { articleMarkdown, getArticles, type Article } from '../../lib/articles'

/**
 * The Markdown twin of every article, at /articles/<slug>.md. Same arrangement
 * as /index.md: the page advertises it with <link rel="alternate">, nginx sends
 * it as a Link header, and the body is the file as it was written rather than
 * HTML turned back into Markdown.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles()
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }))
}

export const GET: APIRoute<{ article: Article }> = ({ props, site }) =>
  new Response(articleMarkdown(props.article, site?.origin ?? '') + '\n', {
    headers: {
      // charset is explicit: the content carries accented characters.
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
