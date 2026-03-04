import Link from "next/link";

/**
 * Custom 404 page.
 * Rendered by Next.js when notFound() is called or a route doesn't match.
 */
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "linear-gradient(135deg, #0e0c00 0%, #00110e 100%)" }}
    >
      <div className="max-w-sm space-y-5">
        <div className="text-5xl" aria-hidden="true">🔎</div>
        <h2 className="text-2xl font-bold text-white">
          ページが見つかりません
        </h2>
        <p className="text-sm text-volt-muted leading-relaxed">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block btn-primary bg-volt-surface text-white/80 border border-volt-edge hover:bg-volt-edge transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
