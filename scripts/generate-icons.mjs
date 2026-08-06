/**
 * Renders the favicon and touch-icon set from public/avatar.jpg. Run with
 * `npm run icons` after changing the avatar; the results are committed, so
 * this is not part of the build.
 *
 * The photo goes through unaltered apart from being desaturated, which is all
 * the site's grayscale-only rule asks for. No contrast curve, no halftone — a
 * plain grey headshot.
 *
 * The avatar is a 1024x1024 head sitting in a lot of empty backdrop. At 16px
 * that backdrop is most of the icon and the face turns to mush, so everything
 * is cut from a tighter square around the head first.
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

// A square cut from the 1024x1024 source: hairline to just under the chin,
// centred on the face rather than on the frame.
const CROP = { left: 180, top: 55, width: 660, height: 660 }

// The dark theme's page colour, from global.css. Only ever shows through if a
// consumer composites the icon over its own surface.
const PAGE = '#14120b'

const source = new URL('../public/avatar.jpg', import.meta.url).pathname
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname

/**
 * The cropped head, desaturated and resized to `size`, as PNG bytes. Each size
 * is resampled straight from the source rather than from a shared master, so
 * none of them carry another size's resampling.
 */
const render = (size) =>
  sharp(source)
    .extract(CROP)
    .resize(size, size, { fit: 'cover', kernel: 'lanczos3' })
    .grayscale()
    .flatten({ background: PAGE })
    .png({ compressionLevel: 9 })
    .toBuffer()

/**
 * Packs PNGs into an ICO container. sharp cannot write ICO, but the format is
 * a 6-byte header, a 16-byte directory entry per image, then the payloads —
 * and since Vista the payload may be a PNG verbatim.
 */
const ico = (images) => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // 1 = icon
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2) // palette size, 0 for truecolour
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

// Legacy favicon.ico, still what some feed readers and Windows shortcuts ask
// for. 48px is the largest size that container is worth carrying.
const ICO_SIZES = [16, 32, 48]
const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await render(size) })),
)

const files = [
  ['favicon.ico', ico(icoImages)],
  // What modern browsers actually pick up for the tab.
  ['favicon-96x96.png', await render(96)],
  // iOS home screen. Apple rounds and masks it itself, so this stays square
  // and opaque — iOS backs a transparent icon with black.
  ['apple-touch-icon.png', await render(180)],
  // Android home screen and the install prompt, via site.webmanifest.
  ['icon-192.png', await render(192)],
  ['icon-512.png', await render(512)],
]

for (const [name, data] of files) {
  await writeFile(out(name), data)
  console.log(`Wrote public/${name} (${data.length} bytes)`)
}
