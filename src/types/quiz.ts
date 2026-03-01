/**
 * Quiz domain type definitions.
 *
 * src/types/ contains TypeScript interface definitions ONLY.
 * Actual question data lives in src/content/[pack]/questions.ts.
 */

/** Maps type_id → score delta contributed by selecting this option */
export type ScoreMap = Partial<Record<string, number>>;

export interface QuestionOption {
  /** Stable option id (e.g. "q01a"). Must be unique within a question. */
  id: string;
  /** Display text shown to the user. Defined in content pack. */
  text: string;
  /** Score contributions when this option is chosen */
  scoreMap: ScoreMap;
}

/** Category used for random question selection. "daily" = everyday scenario, "world" = IP-specific. */
export type QuestionCategory = "daily" | "world";

/** Selection config for random question drawing. Omit from ContentPack to use fixed order. */
export interface QuestionConfig {
  /** Number of "daily" category questions to draw */
  daily: number;
  /** Number of "world" category questions to draw */
  world: number;
}

export interface Question {
  /** Stable question id (e.g. "q01"). Used to correlate with Answer. */
  id: string;
  /** Question text shown to the user. Defined in content pack. */
  text: string;
  options: QuestionOption[];
  /** Category for random selection. Optional — omit for packs without questionConfig. */
  category?: QuestionCategory;
}

/** A single recorded answer from the user during the quiz */
export interface Answer {
  questionId: string;
  optionId: string;
}
