"use client";

import Link from "next/link";

/**
 * Global error boundary — caught by Next.js when a Server Component throws.
 * Must be a Client Component ("use client").
 *
 * Displays a recoverable error screen with retry and home navigation.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      <div className="max-w-sm space-y-5">
        <div className="text-5xl" aria-hidden="true">⚠️</div>
        <h2 className="text-2xl font-bold text-white">
          エラーが発生しました
        </h2>
        <p className="text-sm text-volt-muted leading-relaxed">
          予期しないエラーが発生しました。
          <br />
          再試行するか、トップページに戻ってください。
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-primary text-black transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #fee023 0%, #43d9bf 100%)" }}
          >
            再試行する
          </button>
          <Link
            href="/"
            className="btn-primary bg-volt-surface text-white/80 border border-volt-edge hover:bg-volt-edge transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
