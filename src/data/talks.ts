export interface Talk {
  title: string
  /** Where it was given — conference, meetup or host company. */
  event: string
  date: string
  /** Slides or a recording, when there is one to link to. */
  url?: string
}

/** Most recent first, matching the Writing section. */
export const talks: Talk[] = [
  {
    title: 'AI Inference Stack',
    event: 'Agents Day, Ceeia',
    date: 'July 2026',
  },
  {
    title: 'Building agents, live',
    event: 'Agents Day, Ceeia',
    date: 'July 2026',
  },
  {
    title: 'Agentic Shift, How AI Transformed Engineering at LayerX',
    event: 'Swords Health Office',
    date: 'February 2026',
  },
  {
    title: 'Tracing Web3 Tech Stack Evolutionary Steps',
    event: 'DeHouse',
    date: 'December 2024',
  },
]
