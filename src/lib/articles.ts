/**
 * Everything that turns a file in `articles/` into a thing with a URL: the
 * slug, the ordering, the standalone Markdown rendering, and the merge into the
 * Writing list. It is the single place that knows those rules — the page, the
 * `.md` twin, the feed, the sitemap and `/index.md` all come through here, so
 * they cannot drift apart.
 */
import { getCollection, type CollectionEntry } from 'astro:content'
import { blogPosts, type BlogPost } from '../data/writing'

export type ArticleEntry = CollectionEntry<'articles'>

export interface Article {
  entry: ArticleEntry
  slug: string
  /** Site-relative path of the page. */
  href: string
  /** Site-relative path of the Markdown twin. */
  markdownHref: string
  title: string
  date: Date
  description: string
  tags: string[]
}

/** Where a self-hosted piece was published, in the Writing list's own format. */
const SELF_HOSTED = 'hvasc.dev'

/**
 * The filename carries a `YYYYMMDD_` prefix so the folder sorts by date on
 * disk; the URL does not inherit it. Underscores become hyphens on the way out:
 *
 *   articles/20260811_agi_two_scoreboards.md  ->  /articles/agi-two-scoreboards
 *
 * A `slug` in the frontmatter wins outright and is used verbatim — the glob
 * loader already adopts it as the entry id, so this only makes that explicit.
 */
export function articleSlug(entry: ArticleEntry): string {
  if (entry.data.slug) return entry.data.slug
  return entry.id.replace(/^\d{8}[_-]/, '').replace(/_/g, '-')
}

/** Newest first — the order the Writing list and the feed both want. */
export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles')

  return entries
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => {
      const slug = articleSlug(entry)
      return {
        entry,
        slug,
        href: `/articles/${slug}`,
        markdownHref: `/articles/${slug}.md`,
        title: entry.data.title,
        date: entry.data.date,
        description: entry.data.description,
        tags: entry.data.tags,
      }
    })
}

/**
 * UTC on purpose: the frontmatter dates are plain `YYYY-MM-DD`, which parse as
 * midnight UTC. Formatting them in the build machine's zone would print the
 * previous day anywhere west of Greenwich.
 */
export function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** `2026-08-11`, for <time datetime> and sitemap lastmod. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * One article as a standalone Markdown document: a title, a metadata line, then
 * the body exactly as it was written. `entry.body` is the raw Markdown, so
 * nothing round-trips through HTML on the way here.
 */
export function articleMarkdown(article: Article, origin: string): string {
  const meta = [
    formatArticleDate(article.date),
    article.tags.length ? article.tags.join(', ') : undefined,
    `${origin}${article.href}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return [
    `# ${article.title}`,
    `> ${article.description}`,
    `*${meta}*`,
    (article.entry.body ?? '').trim(),
  ].join('\n\n')
}

/**
 * The Writing list: self-hosted articles first, newest first, then the external
 * posts in `src/data/writing.ts` untouched. Both the page and the Markdown
 * twins render from this, so the two can never disagree about what has been
 * written.
 *
 * Self-hosted entries reuse the external shape, including its `date` field —
 * which is a "where, and when" label rather than a date, hence `hvasc.dev, 2026`.
 */
export async function writingEntries(): Promise<BlogPost[]> {
  const articles = await getArticles()

  return [
    ...articles.map((article) => ({
      title: article.title,
      date: `${SELF_HOSTED}, ${article.date.getUTCFullYear()}`,
      url: article.href,
    })),
    ...blogPosts,
  ]
}
