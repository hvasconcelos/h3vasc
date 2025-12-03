export type SocialPlatform = 'github' | 'linkedin' | 'twitter' | 'link'

export interface SocialLink {
  name: string
  url: string
  platform: SocialPlatform
}

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

