import { QuizFlow } from "@/components/QuizFlow";
import { getContentPack } from "@/lib/contentPack";
import { selectQuestions } from "@/lib/selectQuestions";

/**
 * Quiz page ("/quiz")
 * Server component — resolves the active content pack, selects and shuffles
 * questions server-side, then passes the result to the client QuizFlow.
 *
 * selectQuestions はサーバー側で一度だけ実行することで
 * SSR/クライアント間の hydration mismatch を回避する。
 *
 * SWAP POINT: Set NEXT_PUBLIC_CONTENT_PACK in .env.local to switch packs.
 * Register new packs in src/lib/contentPack.ts.
 */
export default function QuizPage() {
  const { questions, questionConfig } = getContentPack();
  const selectedQuestions = selectQuestions(questions, questionConfig);
  return <QuizFlow questions={selectedQuestions} />;
}
