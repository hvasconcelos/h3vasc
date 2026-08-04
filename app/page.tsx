import { experienceData } from '@/data/experience'
import { educationData } from '@/data/education'
import { socialLinks, SocialPlatform } from '@/data/social'
import { blogPosts } from '@/data/writing'
import CollapsibleSection from '@/components/CollapsibleSection'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { readFileSync } from 'fs'
import { join } from 'path'

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

const iconMap: Record<SocialPlatform, React.FC> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  link: LinkIcon,
}

export default function Home() {
  // Read bio markdown file
  const bioPath = join(process.cwd(), 'content', 'bio.md')
  const bioContent = readFileSync(bioPath, 'utf-8')

  // Extract technologies from HTML comment
  const techMatch = bioContent.match(/<!-- TECHNOLOGIES: (.+) -->/)
  const technologies = techMatch
    ? techMatch[1].split(',').map((tech) => tech.trim())
    : []

  // Remove technologies comment from markdown content
  const markdownContent = bioContent.replace(/<!-- TECHNOLOGIES: .+ -->\s*/g, '')

  return (
    <main className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      {/* Header/Name */}
      <header className="mb-12">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
          Helder Vasconcelos
        </h1>
        <p className="text-sm text-gray-500 font-mono">Porto, Portugal 🇵🇹</p>
      </header>

      {/* Bio Section */}
      <CollapsibleSection id="about" title="About" defaultOpen>
        <div className="space-y-4 text-gray-700 leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
              a: ({ node, ...props }) => (
                <a
                  className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </CollapsibleSection>

      {/* Experience Section */}
      <CollapsibleSection id="experience" title="Experience">
        <div className="space-y-8">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              className="pl-4 border-l-2 border-gray-200 hover:border-gray-400 transition-colors"
            >
              <h3 className="text-gray-900 font-medium">{exp.company}</h3>
              <p className="text-gray-700 text-sm">{exp.role}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-xs text-gray-500 font-mono">
                  {exp.period}
                </span>
                <span className="text-gray-300">·</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{exp.location}</p>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {exp.description}
              </p>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Education Section */}
      <CollapsibleSection id="education" title="Education">
        <div className="space-y-8">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="pl-4 border-l-2 border-gray-200 hover:border-gray-400 transition-colors"
            >
              <h3 className="text-gray-900 font-medium">{edu.institution}</h3>
              <p className="text-gray-700 text-sm">{edu.degree}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-xs text-gray-500 font-mono">
                  {edu.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Blog Posts Section */}
      <CollapsibleSection id="writing" title="Writing">
        <ul className="space-y-6">
          {blogPosts.map((post) => (
            <li key={post.title}>
              <a
                href={post.url}
                className="group block hover:translate-x-1 transition-transform"
              >
                <h3 className="text-gray-900 group-hover:text-gray-600 transition-colors mb-1">
                📖 {post.title}
                </h3>
                <time className="text-xs text-gray-500 font-mono">
                  {post.date}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Footer */}
      <footer className="pt-12">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-mono">
            © {new Date().getFullYear()} Helder Vasconcelos
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.platform]
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Icon />
                </a>
              )
            })}
          </div>
        </div>
      </footer>
    </main>
  )
}
