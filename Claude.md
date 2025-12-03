# Helder Vasconcelos Personal Website

## Project Overview

This is a minimal, grayscale personal website for Helder Vasconcelos, CTO at TAIKAI. The site is built as a static Next.js application optimized for deployment on Vercel.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)
- **Deployment**: Vercel (static export)

## Project Structure

```
h3vasc-web/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Homepage with all sections
│   └── globals.css         # Global styles and Tailwind directives
├── .claude/                # Claude Code configuration
├── next.config.js          # Next.js config (static export enabled)
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── Claude.md              # This file - project context
```

## Key Features

### Sections

1. **Header**
   - Name: Helder Vasconcelos
   - Location: Porto, Portugal

2. **About Section**
   - Professional bio
   - Current role as CTO at TAIKAI
   - "Coder by day, Hacker by night" tagline
   - Education and expertise
   - Book authorship mention
   - Web3 and blockchain specialization

3. **Writing Section**
   - Blog posts list with titles and dates
   - Currently contains placeholder posts
   - Needs to be updated with actual blog URLs

4. **Footer**
   - Copyright notice
   - Social media icons (GitHub, LinkedIn, Twitter, TAIKAI)
   - Icons use SVG components for clean rendering

## Design Principles

- **Minimal & Clean**: White background, grayscale color palette
- **Modern Typography**: Uses Inter for body text, JetBrains Mono for metadata
- **Subtle Interactions**: Hover effects on links and icons
- **Responsive**: Max-width 672px (2xl) for optimal reading
- **Accessibility**: Proper ARIA labels on icon links

### Color Palette

- Background: White (#ffffff)
- Primary text: Gray-900 (#171717)
- Secondary text: Gray-700 (#404040)
- Metadata: Gray-500 (#737373)
- Accents: Gray-400 (#a3a3a3)
- Borders: Gray-200 (#e5e5e5)

## Development

### Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint
npm run lint
```

### Development Server

The dev server runs at `http://localhost:3000` with hot reload enabled.

## Content Updates

### Update Blog Posts

Edit the `blogPosts` array in `app/page.tsx`:

```typescript
const blogPosts = [
  {
    title: 'Your Blog Post Title',
    date: '2024',
    url: 'https://your-blog-url.com',
  },
]
```

### Update Bio

Modify the bio section paragraphs in `app/page.tsx` (lines 57-66).

### Update Social Links

Edit the `socialLinks` array in `app/page.tsx`:

```typescript
const socialLinks = [
  { name: 'Platform', url: 'https://...', icon: IconComponent },
]
```

## Social Media Icons

The site includes SVG icon components for:
- **GitHubIcon**: GitHub profile
- **LinkedInIcon**: LinkedIn profile
- **TwitterIcon**: Twitter/X profile
- **LinkIcon**: Generic link (used for TAIKAI)

Icons are located at the top of `app/page.tsx` as React components.

## Deployment

### Vercel Deployment

The site is configured for static export (`output: 'export'` in `next.config.js`).

**Via Vercel CLI:**
```bash
npm install -g vercel
vercel
```

**Via GitHub:**
1. Push code to GitHub repository
2. Import repository in Vercel dashboard
3. Vercel auto-detects Next.js and deploys

### Build Output

Static files are exported to the `out/` directory during build.

## Profile Information Sources

Bio information gathered from:
- TAIKAI profile: https://taikai.network/heldervasc
- LinkedIn: https://linkedin.com/in/heldervasc
- Twitter: https://x.com/heldervasc

### Key Professional Details

- **Current Role**: CTO at TAIKAI (November 2018–Present)
- **Education**: Electronic and Telecommunications Engineering, University of Aveiro
- **Author**: "Asynchronous Android Programming" (Packt Publishing, 2016)
- **Skills**: Blockchain, Ethereum, DApp development, Web3, C++, Java, Ruby, Python, JavaScript
- **Community**: Speaker and organizer of "Vibe Coding for Creatives" events in Porto
- **Languages**: English, Portuguese (native), Spanish

## Future Enhancements

Potential additions:
- Add actual blog post links
- Projects section with portfolio items
- Speaking engagements section
- Newsletter signup
- Dark mode toggle (optional)
- RSS feed for blog posts
- Analytics integration

## Notes

- Site uses static export for optimal performance on Vercel's edge network
- All images are unoptimized for static export compatibility
- Font loading uses `next/font/google` with swap display strategy
- No client-side JavaScript required for core functionality
