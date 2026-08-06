export interface Release {
  title: string
  year: string
  label: string
  format: string
  url: string
}

export interface MusicProject {
  name: string
  url: string
  description: string
  releases: Release[]
}

export interface Track {
  title: string
  artist: string
  /** Where to hear the whole thing. */
  url: string
  /** The looping excerpt, as paths under public/. */
  src: string
  /**
   * Opus alternative, offered first. MP3 carries encoder padding that `loop`
   * cannot skip, so it seams audibly on every restart; Opus stores its
   * pre-skip in the container and every decoder honours it.
   */
  srcOpus: string
}

/**
 * The loop behind the homepage. A standalone export rather than a field on the
 * Re:Axis project below — it is not one of that project's five releases, and
 * hanging an optional track off MusicProject would imply every project has one.
 *
 * It lives here rather than in AudioPlayer.astro so /index.md can credit it
 * from the same data the page renders from.
 */
export const backgroundTrack: Track = {
  title: 'Liquid Alchemy',
  artist: 'Re:Axis',
  url: 'https://open.spotify.com/track/16Gd4FXepCBPptdJZgFVey?si=2e40435ef8884764',
  src: '/reaxis-liquid-alchemy-loop.mp3',
  srcOpus: '/reaxis-liquid-alchemy-loop.ogg',
}

/** Discography data from https://www.discogs.com */
export const musicProjects: MusicProject[] = [
  {
    name: 'e:4c',
    url: 'https://www.discogs.com/artist/514224-e4c',
    description:
      'Laptop duo from Porto with José Diogo Correia. Experimental and ambient electronics built from field recordings and software sound generation.',
    releases: [
      {
        title: 'Technical Unwanted Signals Vol. 1',
        year: '2007',
        label: 'Test Tube',
        format: '22 tracks',
        url: 'https://www.discogs.com/release/1018601-e4c-Technical-Unwanted-Signals-Vol-1',
      },
      {
        title: 'Data Platform',
        year: '2006',
        label: 'Enough Records',
        format: 'EP, 4 tracks',
        url: 'https://www.discogs.com/release/874132-e4c-Data-Platform',
      },
      {
        title: 'Documents',
        year: '2006',
        label: 'Test Tube',
        format: '2 tracks',
        url: 'https://www.discogs.com/release/687289-e4c-Documents',
      },
    ],
  },
  {
    name: 'Re:Axis',
    url: 'https://www.discogs.com/artist/1006555-ReAxis',
    description:
      'Minimal techno and tech house, released on Autist, Recycle Records and Monocline Records.',
    releases: [
      {
        title: 'Everything Is Going To Be Amazing',
        year: '2009',
        label: 'Monocline Records',
        format: '8 tracks',
        url: 'https://www.discogs.com/master/2864353-ReAxis-Everything-Is-Going-To-Be-Amazing',
      },
      {
        title: 'Random Box EP',
        year: '2009',
        label: 'Autist',
        format: 'EP, 4 tracks',
        url: 'https://www.discogs.com/master/2554496-ReAxis-Random-Box-EP',
      },
      {
        title: 'Archetype',
        year: '2008',
        label: 'Autist',
        format: '3 tracks',
        url: 'https://www.discogs.com/release/1404176-ReAxis-Archetype',
      },
      {
        title: 'Outsider',
        year: '2008',
        label: 'PiSo Records',
        format: '2 tracks',
        url: 'https://www.discogs.com/release/1404183-ReAxis-Outsider',
      },
      {
        title: 'Re:Axis EP',
        year: '2008',
        label: 'Recycle Records',
        format: 'EP, 4 tracks',
        url: 'https://www.discogs.com/release/1404192-ReAxis-ReAxis-EP',
      },
    ],
  },
]
