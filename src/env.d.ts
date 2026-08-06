/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Umami website ID. Analytics are omitted entirely when this is unset, so a
   * build without it — local dev, or somebody's fork — ships no tracker.
   */
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string
  /**
   * Where to load the Umami script from. Defaults to Umami Cloud; point it at
   * your own instance when self-hosting.
   */
  readonly PUBLIC_UMAMI_SRC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
