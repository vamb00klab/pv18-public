/**
 * Application configuration.
 *
 * Design intent:
 *   - appCode: internal identifier ("pv18"), hardcoded, never shown to end users
 *   - displayName: brand/display name, controlled via env for easy swapping
 *
 * To rename the displayed brand, set NEXT_PUBLIC_DISPLAY_NAME in .env.local.
 * The codebase itself does not need to change.
 */
export const appConfig = {
  /** Internal code name — used in storage keys, analytics, etc. Never rename. */
  appCode: "pv18" as const,

  /** Human-facing brand name. Override via env: NEXT_PUBLIC_DISPLAY_NAME */
  displayName: process.env.NEXT_PUBLIC_DISPLAY_NAME ?? "PersonaVOLT18",

  /** Tagline shown on landing page. Override via env: NEXT_PUBLIC_TAGLINE */
  tagline:
    process.env.NEXT_PUBLIC_TAGLINE ?? "キミだけの「ポケミク」を探そう",

  /**
   * Active content pack key.
   * Maps to /src/content/[contentPack]/ directory.
   * Override via env: NEXT_PUBLIC_CONTENT_PACK
   */
  contentPack: process.env.NEXT_PUBLIC_CONTENT_PACK ?? "pokemon",

  /** Base URL for share links. Override via env: NEXT_PUBLIC_BASE_URL */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  /** Total number of types (fixed at 18 for this app) */
  totalTypes: 18,
} as const;

export type AppConfig = typeof appConfig;
