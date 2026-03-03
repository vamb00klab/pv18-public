import { Suspense } from "react";
import type { Metadata } from "next";
import { ResultClient } from "./ResultClient";
import { getContentPack } from "@/lib/contentPack";
import { decodeAnswers } from "@/lib/answerUrl";
import { diagnose } from "@/lib/diagnose";
import { appConfig } from "@/lib/config";

/**
 * Dynamic metadata for the result page.
 * Decodes ?a= to determine the type label for SNS previews.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const decoded = decodeAnswers(resolvedParams.a);
  if (decoded.ok) {
    const { questions, types } = getContentPack();
    try {
      const { result } = diagnose(decoded.answers, questions, types);
      return {
        title: `キミは「${result.label}」`,
        openGraph: {
          title: `キミは「${result.label}」 | ${appConfig.displayName}`,
          description: result.description,
        },
        twitter: {
          title: `キミは「${result.label}」 | ${appConfig.displayName}`,
          description: result.description,
        },
      };
    } catch {
      // Fall through to default metadata
    }
  }
  return { title: "診断結果" };
}

/**
 * Result page ("/result") — Server Component
 *
 * Resolves the active content pack here (server side) and passes it as
 * props to ResultClient. This ensures content-pack switching via env works
 * without touching any client-side import.
 *
 * Wrapped in <Suspense> because ResultClient uses useSearchParams().
 */
export default function ResultPage() {
  const { questions, types, axes, typeScores } = getContentPack();

  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
        >
          <p className="text-volt-muted animate-pulse">結果を読み込んでいます...</p>
        </div>
      }
    >
      <ResultClient
        questions={questions}
        types={types}
        axes={axes}
        typeScores={typeScores}
      />
    </Suspense>
  );
}
