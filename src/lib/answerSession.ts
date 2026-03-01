/**
 * Session storage adapter for in-progress quiz answers.
 *
 * Responsibility: persist Answer[] across page reloads within a tab.
 * Does NOT handle URL encoding or routing.
 *
 * Extension guide — to add server-side persistence:
 *   1. Create src/lib/answerApi.ts with async save/load/clear methods
 *   2. Swap this import in QuizFlow.tsx (the only caller)
 *   3. Add userId scoping: `${KEY}_${userId}` for multi-user support
 */
import type { Answer } from "@/types/quiz";
import { appConfig } from "./config";

const KEY = `${appConfig.appCode}_answers` as const;

export const answerSession = {
  save(answers: Answer[]): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(answers));
    } catch {
      // Quota exceeded or private-browsing restriction — silently no-op
    }
  },

  load(): Answer[] | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Answer[];
    } catch {
      return null;
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(KEY);
  },
};
