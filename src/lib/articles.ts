/**
 * Everything that turns a file in `articles/` into a thing with a URL: the
 * slug, the ordering, the standalone Markdown rendering, and the merge into the
 * Writing list. It is the single place that knows those rules — the page, the
 * `.md` twin, the feed, the sitemap and `/index.md` all come through here, so
 * they cannot drift apart.
 */
import { closeSync, openSync, readSync } from 'node:fs'
import { join } from 'node:path'
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
  /** Social card for this piece, or undefined to fall back to /og.png. */
  cover?: string
  coverAlt?: string
  /** Read off the file, so a re-export at another size can't go stale. */
  coverWidth?: number
  coverHeight?: number
  /** Whole minutes, never zero. */
  readingMinutes: number
}

/**
 * 220 words a minute, which is the middle of the range for adult reading and
 * a little generous for this material.
 */
const WORDS_PER_MINUTE = 220

/**
 * An article's reading time, from its Markdown source.
 *
 * The figures come out first. A scoreboard is a hundred lines of SVG carrying
 * a few dozen labels, and counting either the markup or the labels as prose
 * would put minutes on the estimate that nobody spends reading. What is left
 * has its link hrefs and Markdown punctuation dropped, so `[text](url)` counts
 * as the words a person actually reads.
 */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>|]/g, ' ')
    .trim()

  const words = prose ? prose.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/**
 * A PNG's dimensions, straight out of its IHDR: 8 bytes of signature, a chunk
 * length, the tag, then width and height as big-endian uint32s. Twenty-four
 * bytes off the front of the file, no decode and no dependency.
 *
 * Worth reading rather than declaring in frontmatter. The page needs the real
 * ratio to reserve space for the image, and og:image:width has to match what
 * is actually served; both go quietly wrong the first time a cover is
 * re-exported at another size, and neither failure is visible in review.
 *
 * `process.cwd()` rather than `import.meta.url`: this module is bundled before
 * it runs, and its own URL by then points into the build output.
 */
function pngSize(publicPath: string) {
  try {
    const fd = openSync(join(process.cwd(), 'public', publicPath), 'r')
    const header = Buffer.alloc(24)
    readSync(fd, header, 0, 24, 0)
    closeSync(fd)

    if (header.toString('ascii', 12, 16) !== 'IHDR') return {}
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
  } catch {
    // A missing or unreadable cover is not worth failing a build over; the
    // page falls back to leaving the dimensions off.
    return {}
  }
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
      const size = entry.data.cover ? pngSize(entry.data.cover) : {}
      return {
        entry,
        slug,
        href: `/articles/${slug}`,
        markdownHref: `/articles/${slug}.md`,
        title: entry.data.title,
        date: entry.data.date,
        description: entry.data.description,
        tags: entry.data.tags,
        cover: entry.data.cover,
        coverAlt: entry.data.coverAlt,
        coverWidth: size.width,
        coverHeight: size.height,
        readingMinutes: readingMinutes(entry.body ?? ''),
      }
    })
}

/**
 * A title's display lines. A title made of more than one sentence breaks
 * between them, so the h1 reads the way the title was written rather than
 * wherever the column happens to run out.
 *
 * A rule instead of a second frontmatter field: a `titleLines` array would
 * duplicate the title and drift from it the first time one of the two is
 * edited. Each returned line still wraps on its own if the viewport is
 * narrower than it, so this sets the preferred break, not a fixed one.
 *
 * It splits on sentence-ending punctuation, so a title carrying an
 * abbreviation ("Pt. 1") would break inside it. Reword or accept it.
 */
export function titleLines(title: string): string[] {
  return title.split(/(?<=[.?!])\s+/).filter(Boolean)
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
    `${article.readingMinutes} min read`,
    article.tags.length ? article.tags.join(', ') : undefined,
    `${origin}${article.href}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return [
    `# ${article.title}`,
    `> ${article.description}`,
    `*${meta}*`,
    // The page opens with the cover, so the twin does too.
    article.cover && `![${article.coverAlt ?? ''}](${origin}${article.cover})`,
    (article.entry.body ?? '').trim(),
  ]
    .filter(Boolean)
    .join('\n\n')
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
