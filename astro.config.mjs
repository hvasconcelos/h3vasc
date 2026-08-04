// @ts-check
import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import tailwindcss from '@tailwindcss/vite'

/**
 * Markdown links (the bio) open in a new tab, matching the rest of the site.
 * Written against Sätteri's hast visitor API, which is Astro's default
 * Markdown processor.
 *
 * @type {NonNullable<import('@astrojs/markdown-satteri').SatteriProcessorOptions['hastPlugins']>[number]}
 */
const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href
      if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return
      ctx.setProperty(node, 'target', '_blank')
      ctx.setProperty(node, 'rel', ['noopener', 'noreferrer'])
    },
  },
}

// https://astro.build/config
export default defineConfig({
  site: 'https://h3vasc.com',
  // Fully static output — the built site in dist/ is plain HTML/CSS/JS.
  output: 'static',
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
