/**
 * PersonaType interface — IP-agnostic structural definition.
 *
 * src/types/ contains TypeScript interface definitions ONLY.
 * Actual data (labels, descriptions, colors) lives in src/content/[pack]/.
 *
 * The separation means: changing IP-specific content never touches this file,
 * and TypeScript catches mismatches between packs and this contract.
 */
export interface PersonaType {
  /** Stable internal key. Never rename — it's the key in scoreMap. */
  type_id: string;
  /** Display label shown in UI. Defined in content pack. */
  label: string;
  /** Short uppercase tag (e.g. "ARDENT"). Defined in content pack. */
  shortLabel: string;
  /** Full description shown on result page. Defined in content pack. */
  description: string;
  /** Personality trait keywords shown as chips. Defined in content pack. */
  traits: string[];
  /** Primary hex color for this type (e.g. "#E84D1C") */
  color: string;
  /** Light background hex color for result card (e.g. "#FFF2EE") */
  bgColor: string;
  /** Optional path to type icon image (e.g. "/icons/types/fire.png"). Omit if pack has no icons. */
  iconPath?: string;
  /** Short phrases describing situations where this type thrives. Defined in content pack. */
  suitableFor?: string[];
  /** Key strengths of this type (2 items). Defined in content pack. */
  strengths?: string[];
  /** Key weaknesses or blind spots of this type (2 items). Defined in content pack. */
  weaknesses?: string[];
  /** Optional link to an official external page for this type. Defined in content pack. */
  officialUrl?: string;
}
