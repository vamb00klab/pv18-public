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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <div className="max-w-sm space-y-5">
        <div className="text-5xl" aria-hidden="true">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">
          エラーが発生しました
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          予期しないエラーが発生しました。
          <br />
          再試行するか、トップページに戻ってください。
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            再試行する
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
