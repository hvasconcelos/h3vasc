export interface BioLink {
  text: string
  url: string
}

export interface BioParagraph {
  text: string
  links?: BioLink[]
  italicText?: string
  technologies?: string[]
}

export const bioParagraphs: BioParagraph[] = [
  {
    text: 'Chief Technology Officer at {link}. Building the infrastructure for decentralized innovation on Ethereum Ecosystems.',
    links: [{ text: 'LayerX', url: 'https://layerx.xyz' }],
  },
  {
    text: 'Architect of DeFi protocols and real-time systems. From trading engines at Euronext processing millions of orders to smart contracts securing on-chain capital obsessed with systems that demand zero downtime.',
  },
  {
    text: 'Shipped {link1}, {link2}, {link3}, {link4}, and other Web3 products. ',
    links: [
      { text: 'TAIKAI', url: 'https://taikai.network' },
      { text: 'TAIKAI Garden', url: 'https://garden.taikai.network' },
      { text: 'BakerFi', url: 'https://bakerfi.xyz' },
      { text: 'Bepro Network', url: 'https://bepro.network' },
    ]
  },
  {
    text: 'Published {italic} (Packt, 2016). Master\'s in Electronic and Telecommunications Engineering from University of Aveiro.',
    italicText: 'Asynchronous Android Programming',
  },
  {
    text: 'Defi Wizard 🧙',

  }, {
    text: '',
    technologies: ['Solidity', 'TypeScript', 'C++', 'Java', 'Rust', 'Node.js', 'Kubernetes'],
  }
]

