/**
 * Renders public/og.png, the 1200x630 card social platforms show when the
 * site is linked. Run with `npm run og` after changing the avatar or the
 * strings below; the result is committed, so this is not part of the build.
 *
 * The SVG is rasterised by sharp (librsvg), which resolves font families
 * through the system, not through the site's webfonts. Keep the families
 * below to ones macOS ships.
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const WIDTH = 1200
const HEIGHT = 630

const PROMPT_HOST = 'helder@h3vasc'
const PROMPT_CMD = '$ whoami'
const NAME = 'Hélder Vasconcelos'
const ROLE = 'Chief Technology Officer at LayerX'
const FOCUS = ['agentic workflows', 'llm inference', 'high performance systems']
const SITE = 'h3vasc.com'
const LOCATION = 'Porto, Portugal'

// Same values as the site's dark theme in global.css.
const PAGE = '#08090a'
const HAIRLINE = '#333333'
const ACCENT = '#fafafa'
const PRIMARY = '#fafafa'
const SECONDARY = '#d4d4d4'
const MUTED = '#a3a3a3'

// The site is set in JetBrains Mono, which exists here only as a webfont;
// librsvg resolves families through the system, so this falls back to Menlo.
const MONO = 'Menlo, Monaco, monospace'

const avatar = readFileSync(new URL('../public/avatar.jpg', import.meta.url))
const avatarUri = `data:image/jpeg;base64,${avatar.toString('base64')}`

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <clipPath id="avatarClip">
      <circle cx="238" cy="300" r="104" />
    </clipPath>
    <filter id="desaturate">
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAGE}" />
  <rect x="48" y="48" width="${WIDTH - 96}" height="${HEIGHT - 96}" fill="none" stroke="${HAIRLINE}" stroke-width="1" />

  <image
    xlink:href="${avatarUri}"
    x="134" y="196" width="208" height="208"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#avatarClip)"
    filter="url(#desaturate)" />
  <circle cx="238" cy="300" r="104" fill="none" stroke="${HAIRLINE}" stroke-width="1" />

  <text x="404" y="224" font-family="${MONO}" font-size="19" fill="${MUTED}"><tspan fill="${ACCENT}">${escape(PROMPT_HOST)}</tspan>:~${escape(PROMPT_CMD)}</text>

  <text x="404" y="288" font-family="${MONO}" font-size="47" font-weight="500" fill="${PRIMARY}" letter-spacing="-1">${escape(NAME)}<tspan fill="${ACCENT}"> ▋</tspan></text>
  <text x="404" y="334" font-family="${MONO}" font-size="22" fill="${SECONDARY}">${escape(ROLE)}</text>

  <line x1="404" y1="372" x2="600" y2="372" stroke="${HAIRLINE}" stroke-width="1" />

  <text x="404" y="412" font-family="${MONO}" font-size="18" fill="${MUTED}">${FOCUS.map((f) => `[${escape(f)}]`).join(' ')}</text>

  <text x="96" y="546" font-family="${MONO}" font-size="18" fill="${MUTED}">${escape(SITE)}</text>
  <text x="${WIDTH - 96}" y="546" text-anchor="end" font-family="${MONO}" font-size="18" fill="${MUTED}">${escape(LOCATION)}</text>
</svg>`

const out = new URL('../public/og.png', import.meta.url)
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out.pathname)

console.log(`Wrote ${out.pathname} (${WIDTH}x${HEIGHT})`)
