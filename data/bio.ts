export interface BioLink {
  text: string
  url: string
}

export interface BioParagraph {
  text: string
  links?: BioLink[]
  italicText?: string
}

export const bioParagraphs: BioParagraph[] = [
  {
    text: 'Chief Technology Officer at {link}. Coder by day, Hacker by night.',
    links: [{ text: 'TAIKAI', url: 'https://taikai.network' }],
  },
  {
    text: 'Software engineer with expertise in blockchain, Web3, and full-stack development. Author of {italic} (Packt Publishing, 2016).',
    italicText: 'Asynchronous Android Programming',
  },
  {
    text: 'Electronic and Telecommunications Engineering degree from University of Aveiro. Active in the Web3 community as a speaker and event organizer, including "Vibe Coding for Creatives" events in Porto.',
  },
  {
    text: 'Specialized in blockchain development (Ethereum, EOS), distributed systems, and DApp architecture. Fluent in multiple programming languages including C++, Java, Ruby, Python, and JavaScript.',
  },
]

