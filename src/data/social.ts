export type SocialPlatform = 'github' | 'linkedin' | 'twitter' | 'link'

export interface SocialLink {
  name: string
  url: string
  platform: SocialPlatform
}

/**
 * This site's own source. Deliberately not a member of socialLinks below —
 * that array is profiles, and every entry in it renders an icon in the footer
 * row. This one is a repository and renders as text next to the copyright.
 */
export const sourceRepo = 'https://github.com/hvasconcelos/hvascdev'

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/hvasconcelos',
    platform: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/heldervasc',
    platform: 'linkedin',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/heldervasc',
    platform: 'twitter',
  },
  {
    name: 'TAIKAI',
    url: 'https://taikai.network/heldervasc',
    platform: 'link',
  },
]

