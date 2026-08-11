/**
 * Renders the site's content as Markdown, from the same `src/data/` modules
 * the page renders from. Nothing here restates content: change a data file and
 * both the HTML and the Markdown twin follow.
 *
 * Three endpoints consume this — `/index.md` (the whole page as Markdown),
 * `/llms-full.txt` (that plus every article in full) and `/llms.txt` (a short
 * index pointing at both).
 */
import bioMarkdown from '../data/bio.md?raw'
import { educationData } from '../data/education'
import { experienceData } from '../data/experience'
import { musicProjects } from '../data/music'
import { projects } from '../data/projects'
import { socialLinks, sourceRepo } from '../data/social'
import { talks } from '../data/talks'
import { articleMarkdown, getArticles, writingEntries } from './articles'

export const NAME = 'Hélder Vasconcelos'

export const SUMMARY =
  'CTO and co-founder at LayerX, in Porto. Agentic workflows, LLM inference and high performance systems.'

/** Joins non-empty blocks with a blank line, so absent fields leave no gap. */
const blocks = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join('\n\n')

/**
 * Self-hosted writing is site-relative in the data; a Markdown file that may be
 * read anywhere needs the whole URL. External links pass through untouched.
 */
const absolute = (url: string, origin: string) =>
  url.startsWith('/') ? `${origin}${url}` : url

/**
 * The full page as Markdown. `origin` comes from `Astro.site` rather than a
 * constant, so the domain lives in astro.config.mjs alone.
 *
 * Async because the Writing list now includes the articles collection, which is
 * only reachable through `getCollection`.
 */
export async function renderSiteMarkdown(origin: string): Promise<string> {
  const projectList = projects.map((project) =>
    blocks(
      `### [${project.name}](${project.url})`,
      project.language && `Language: ${project.language}`,
      project.description
    )
  )

  const experienceList = experienceData.map((exp) =>
    blocks(
      `### ${exp.company} — ${exp.role}`,
      `${exp.period} · ${exp.location} · ${exp.type}`,
      exp.description,
      exp.technologies?.length
        ? `Technologies: ${exp.technologies.join(', ')}`
        : undefined
    )
  )

  const musicList = musicProjects.map((project) =>
    blocks(
      `### [${project.name}](${project.url})`,
      project.description,
      project.releases
        .map(
          (release) =>
            `- [${release.title}](${release.url}) — ${release.label}, ${release.year} · ${release.format}`
        )
        .join('\n')
    )
  )

  const writing = await writingEntries()

  return (
    blocks(
      `# ${NAME}`,
      `> ${SUMMARY}`,
      [
        `- Role: Chief Technology Officer and Co-Founder at [LayerX](https://layerx.xyz)`,
        `- Location: Porto, Portugal`,
        `- Website: ${origin}`,
      ].join('\n'),

      '## About',
      bioMarkdown.trim(),

      '## Side Projects',
      ...projectList,

      '## Writing',
      writing
        .map(
          (post) =>
            `- [${post.title}](${absolute(post.url, origin)}) — ${post.date}`
        )
        .join('\n'),

      '## Recent Talks',
      talks
        .map((talk) => {
          const title = talk.url ? `[${talk.title}](${talk.url})` : talk.title
          return `- ${title} — ${talk.event}, ${talk.date}`
        })
        .join('\n'),

      '## Experience',
      ...experienceList,

      '## Education',
      educationData
        .map((edu) => `- ${edu.institution} — ${edu.degree} (${edu.period})`)
        .join('\n'),

      '## Music',
      ...musicList,

      '## Elsewhere',
      socialLinks.map((link) => `- [${link.name}](${link.url})`).join('\n'),

      '## Source',
      `This site is open source and MIT licensed — [fork it](${sourceRepo}).`
    ) + '\n'
  )
}

/**
 * llms-full.txt — the profile followed by every self-hosted article in full.
 *
 * This is the one endpoint that is more than /index.md: an agent that fetches
 * "everything in one file" should not then have to follow a link per article to
 * read the writing. The homepage half is the same render, so the two can still
 * only disagree by way of the data.
 */
export async function renderLlmsFullTxt(origin: string): Promise<string> {
  const articles = await getArticles()
  if (articles.length === 0) return renderSiteMarkdown(origin)

  return blocks(
    (await renderSiteMarkdown(origin)).trim(),
    '---',
    '# Full Articles',
    `The self-hosted writing listed above, in full. Each is also available on its own at ${origin}/articles/<slug>.md`,
    ...articles.map((article) => articleMarkdown(article, origin))
  ) + '\n'
}

/**
 * llms.txt, per the llms.txt convention: an H1, a blockquote summary, then
 * link sections. Deliberately an index rather than a copy — the content itself
 * lives at /index.md and /llms-full.txt, and duplicating it here would only
 * create a third thing to keep in sync.
 */
export async function renderLlmsTxt(origin: string): Promise<string> {
  const articles = await getArticles()
  const writing = await writingEntries()

  return (
    blocks(
      `# ${NAME}`,
      `> ${SUMMARY}`,
      'Personal site. The full content of the page is available as Markdown; the HTML at the root is the same content with styling.',

      '## Content',
      [
        `- [Full profile in Markdown](${origin}/index.md): about, side projects, writing, talks, experience, education and music`,
        `- [Everything in one file](${origin}/llms-full.txt): the profile plus every article in full`,
        `- [Homepage](${origin}/): the same content as HTML`,
        `- [Feed](${origin}/rss.xml): RSS for the self-hosted articles`,
        `- [Source](${sourceRepo}): the site's own repository, MIT licensed`,
      ].join('\n'),

      // Self-hosted pieces point at their Markdown rather than the page: this
      // file is read by things that would rather not parse HTML.
      articles.length > 0 && '## Articles',
      articles.length > 0 &&
        articles
          .map(
            (article) =>
              `- [${article.title}](${origin}${article.markdownHref}): ${article.description}`
          )
          .join('\n'),

      '## Writing',
      writing
        .map(
          (post) => `- [${post.title}](${absolute(post.url, origin)}): ${post.date}`
        )
        .join('\n'),

      '## Elsewhere',
      socialLinks.map((link) => `- [${link.name}](${link.url})`).join('\n')
    ) + '\n'
  )
}
