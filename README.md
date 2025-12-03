# Helder Vasconcelos - Personal Website

A minimal, grayscale personal website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Bio section with professional background
- Social links (GitHub, LinkedIn, Twitter, TAIKAI)
- Blog posts section
- Minimal grayscale design with modern typography
- Fully static site optimized for Vercel deployment

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

This generates a static export in the `out` directory.

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy

The site is configured for static export and will work perfectly on Vercel's edge network.

## Customization

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

Edit the bio section in `app/page.tsx` to update your personal information.

### Update Links

Modify the `socialLinks` array in `app/page.tsx` to add or remove links.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Inter & JetBrains Mono fonts
