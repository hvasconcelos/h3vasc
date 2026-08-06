/**
 * Renders the favicon and touch-icon set from public/avatar.jpg. Run with
 * `npm run icons` after changing the avatar; the results are committed, so
 * this is not part of the build.
 *
 * The photo is reduced to the site's two end tones and ordered-dithered, so it
 * reads as grayscale halftone rather than as a colour headshot. Two things
 * make that work at every size:
 *
 *   - The avatar is a 1024x1024 head sitting in a lot of empty backdrop. At
 *     16px that backdrop is most of the icon, so everything is cut from a
 *     tighter square around the head first.
 *   - The dither is applied ONCE, to a single master, and every output is
 *     downscaled from it. The halftone is then visible at 180px and above and
 *     averages back into smooth grey below — dithering each size separately
 *     instead turns 16px and 32px into noise.
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

// A square cut from the 1024x1024 source: hairline to just under the chin,
// centred on the face rather than on the frame.
const CROP = { left: 180, top: 55, width: 660, height: 660 }

// The two ends of the ramp in global.css: the light page and its foreground.
// The image is reduced to these two values and nothing between them.
const LIGHT = [0xf7, 0xf7, 0xf4]
const DARK = [0x26, 0x25, 0x1e]

// The master everything is downscaled from, and the pixel size of one halftone
// dot within it. DOT=2 at 512 puts the dot pitch at an effective 256 — coarse
// enough to still read as halftone at 180px, fine enough to keep the face.
const MASTER = 512
const DOT = 2

// Photographic mid-tones sit too close together to survive a two-tone
// reduction; without this lift the face flattens into the backdrop.
const CONTRAST = 1.4

// Ordered (Bayer) 8x8, normalised to 0..1 thresholds. Ordered rather than
// error-diffused on purpose: the regular weave survives downscaling as an even
// grey, where Floyd-Steinberg's noise turns blotchy.
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64))

const source = new URL('../public/avatar.jpg', import.meta.url).pathname
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname

/** The cropped head as one dithered two-tone image, MASTER px square. */
async function renderMaster() {
  const { data } = await sharp(source)
    .extract(CROP)
    .resize(MASTER, MASTER, { fit: 'cover', kernel: 'lanczos3' })
    .grayscale()
    .normalise()
    .linear(CONTRAST, 0)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.alloc(MASTER * MASTER * 3)
  for (let y = 0; y < MASTER; y++) {
    for (let x = 0; x < MASTER; x++) {
      // Indexing the matrix by x/DOT scales one dot up to DOT px square.
      const threshold = BAYER[((y / DOT) | 0) % 8][((x / DOT) | 0) % 8]
      const tone = data[y * MASTER + x] / 255 > threshold ? LIGHT : DARK
      const o = (y * MASTER + x) * 3
      pixels[o] = tone[0]
      pixels[o + 1] = tone[1]
      pixels[o + 2] = tone[2]
    }
  }

  return sharp(pixels, { raw: { width: MASTER, height: MASTER, channels: 3 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const master = await renderMaster()

/** The master downscaled to `size`, as PNG bytes. */
const render = (size) =>
  size === MASTER
    ? master
    : sharp(master)
        .resize(size, size, { kernel: 'lanczos3' })
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
  // iOS home screen. Apple rounds and masks it itself, so this stays square.
  // It is opaque for free: the two-tone reduction leaves no alpha channel, and
  // iOS backs a transparent icon with black.
  ['apple-touch-icon.png', await render(180)],
  // Android home screen and the install prompt, via site.webmanifest.
  ['icon-192.png', await render(192)],
  ['icon-512.png', await render(MASTER)],
]

for (const [name, data] of files) {
  await writeFile(out(name), data)
  console.log(`Wrote public/${name} (${data.length} bytes)`)
}
