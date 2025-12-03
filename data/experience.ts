export interface Experience {
  company: string
  role: string
  type: string
  period: string
  location: string
  description: string
  technologies?: string[]
}

export const experienceData: Experience[] = [
  {
    company: 'LayerX',
    role: 'Chief Technology Officer',
    type: 'Full-time',
    period: 'Nov 2018 - Present',
    location: 'Porto, Portugal · Hybrid',
    description: 'Building TAIKAI, Bepro , BakerFi, ChainCast and other web3 products.',
    technologies: ['TypeScript', 'Solidity', 'Kubernetes', 'Ethereum', 'Node.js', "Rust", 'Web3']
  },
  {
    company: 'Euronext',
    role: 'Tech Lead',
    type: 'Full-time',
    period: 'Nov 2016 - Nov 2018',
    location: 'Porto e Região, Portugal',
    description: 'Optiq Commercial Tech Lead. Building Optiq, a realtime trading engine for the European Stock Exchange.',
    technologies: ['C++11/14', 'FIX', 'Apache Kafka','High Frequency Trading', 'Linux', 'Docker'],
  },
  {
    company: 'Axway',
    role: 'Senior Software Engineer',
    type: 'Full-time',
    period: 'Jan 2014 - Oct 2016',
    location: 'Dublin, Ireland',
    description:
      'Implementation, design and development of features for Axway APIGateway and API Manager. APIGateway application tuning for high level of demand usage scenarios. Cryptography and OpenSSL Programming. APIGateway Java and C/C++ integration with cryptographic external HSM devices.',
    technologies: ['C++', 'Java', 'HSM', 'JNI', 'Docker', 'OpenSSL', 'API Gateway'],
  },
  {
    company: 'Airtel ATN',
    role: 'Senior Software Engineer',
    type: 'Full-time',
    period: 'Oct 2012 - Jan 2014',
    location: 'Dublin, Ireland',
    description:
      'Contributed to ATN (Aeronautical Communication network) CM, CPDLC and ADS-C Test Tools by designing/developing several new features and resolving existing bugs.',
    technologies: ['C/C++', 'Tcl/Tk', 'Ruby', 'Aviation'],
  },
  {
    company: 'PT Inovação',
    role: 'Telecommunications & Software Engineer',
    type: 'Full-time',
    period: 'Sep 2007 - Oct 2012',
    location: 'Aveiro, Portugal',
    description:
      'Designed and Developed IMS (IP Multimedia Subsystem), SMS and Mobile software solutions to Portugal Telecom Group. Supported other interns in various development and learning tasks. Collaborated with 24/7 support team solving production issues.',
    technologies: ['C/C++', 'Java SE', 'Ruby+RoR', 'SIP'],
  },
  {
    company: 'Monocline Records',
    role: 'Record Label Manager',
    type: 'Part-time',
    period: 'Mar 2008 - Jun 2011',
    location: 'Aveiro e Região, Portugal',
    description: 'Product Management and Web Development.',
    technologies: ['Brand Management', 'Audio Production', 'Marketing & Promotion'],
  }
]

