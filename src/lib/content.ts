/**
 * Renders the site's content as Markdown, from the same `src/data/` modules
 * the page renders from. Nothing here restates content: change a data file and
 * both the HTML and the Markdown twin follow.
 *
 * Two endpoints consume this — `/index.md` (the whole page as Markdown) and
 * `/llms.txt` (a short index pointing at it).
 */
import bioMarkdown from '../data/bio.md?raw'
import { educationData } from '../data/education'
import { experienceData } from '../data/experience'
import { musicProjects } from '../data/music'
import { projects } from '../data/projects'
import { socialLinks, sourceRepo } from '../data/social'
import { talks } from '../data/talks'
import { blogPosts } from '../data/writing'

export const NAME = 'Hélder Vasconcelos'

export const SUMMARY =
  'CTO and co-founder at LayerX, in Porto. Agentic workflows, LLM inference and high performance systems.'

/** Joins non-empty blocks with a blank line, so absent fields leave no gap. */
const blocks = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join('\n\n')

/**
 * The full page as Markdown. `origin` comes from `Astro.site` rather than a
 * constant, so the domain lives in astro.config.mjs alone.
 */
export function renderSiteMarkdown(origin: string): string {
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
      blogPosts
        .map((post) => `- [${post.title}](${post.url}) — ${post.date}`)
        .join('\n'),

      '## Recent Talks',
      talks
        .map((talk) => {
          const title = talk.url ? `[${talk.title}](${talk.url})` : talk.title
          return `- ${title} — ${talk.event}, ${talk.date}`
        })
        .join('\n'),

      '## Music',
      ...musicList,

      '## Experience',
      ...experienceList,

      '## Education',
      educationData
        .map((edu) => `- ${edu.institution} — ${edu.degree} (${edu.period})`)
        .join('\n'),

      '## Elsewhere',
      socialLinks.map((link) => `- [${link.name}](${link.url})`).join('\n'),

      '## Source',
      `This site is open source and MIT licensed — [fork it](${sourceRepo}).`
    ) + '\n'
  )
}

/**
 * llms.txt, per the llms.txt convention: an H1, a blockquote summary, then
 * link sections. Deliberately an index rather than a copy — the content itself
 * lives at /index.md, and duplicating it here would only create a second thing
 * to keep in sync.
 */
export function renderLlmsTxt(origin: string): string {
  return (
    blocks(
      `# ${NAME}`,
      `> ${SUMMARY}`,
      'Personal site. The full content of the page is available as Markdown; the HTML at the root is the same content with styling.',

      '## Content',
      [
        `- [Full profile in Markdown](${origin}/index.md): about, side projects, writing, music, experience and education`,
        `- [Homepage](${origin}/): the same content as HTML`,
        `- [Source](${sourceRepo}): the site's own repository, MIT licensed`,
      ].join('\n'),

      '## Writing',
      blogPosts
        .map((post) => `- [${post.title}](${post.url}): ${post.date}`)
        .join('\n'),

      '## Elsewhere',
      socialLinks.map((link) => `- [${link.name}](${link.url})`).join('\n')
    ) + '\n'
  )
}
