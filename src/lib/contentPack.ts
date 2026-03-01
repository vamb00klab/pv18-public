/**
 * Content pack registry — the single switch point for IP content.
 *
 * To swap all labels, descriptions, and questions at once:
 *   1. Create src/content/[your-pack]/ (copy pokemon/ as a template)
 *   2. Register it in the `registry` object below
 *   3. Set NEXT_PUBLIC_CONTENT_PACK=[your-pack] in .env.local
 *
 * No other files need to change.
 */
import { appConfig } from "./config";
import type { PersonaType } from "@/types/persona";
import type { Question, QuestionConfig } from "@/types/quiz";
import type { Axis, TypeAxisProfile } from "@/types/axis";

// Import all packs here (build-time static imports for Next.js compatibility)
import { pokemonTypes, pokemonQuestions, pokemonAxes, pokemonTypeScores } from "@/content/pokemon";

export interface ContentPack {
  types: PersonaType[];
  questions: Question[];
  /** 性格軸定義。未設定時はレーダーチャートを非表示。 */
  axes?: Axis[];
  /** タイプ × 軸スコアマッピング。未設定時はレーダーチャートを非表示。 */
  typeScores?: TypeAxisProfile[];
  /**
   * 質問ランダム選出設定。未設定時は全問固定順で使用。
   * 設定時は daily / world カテゴリからそれぞれ指定数をランダム抽出。
   */
  questionConfig?: QuestionConfig;
}

/**
 * Pack registry.
 * Add new packs here as: [packId]: { types, questions }
 */
const registry: Record<string, ContentPack> = {
  pokemon: {
    types: pokemonTypes,
    questions: pokemonQuestions,
    axes: pokemonAxes,
    typeScores: pokemonTypeScores,
    questionConfig: { daily: 8, world: 7 },
  },
};

/**
 * Returns the active content pack.
 * Resolves: explicit packId > NEXT_PUBLIC_CONTENT_PACK env > "pokemon"
 * Falls back to "pokemon" with a warning if the specified pack is not registered.
 */
export function getContentPack(packId?: string): ContentPack {
  const id = packId ?? appConfig.contentPack;
  if (id in registry) return registry[id];

  console.warn(
    `[pv18] Content pack "${id}" is not registered. ` +
      `Add it to the registry in src/lib/contentPack.ts. Falling back to "pokemon".`
  );
  return registry.pokemon;
}
