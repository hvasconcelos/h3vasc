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
