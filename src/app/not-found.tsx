import Link from "next/link";

/**
 * Custom 404 page.
 * Rendered by Next.js when notFound() is called or a route doesn't match.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <div className="max-w-sm space-y-5">
        <div className="text-5xl" aria-hidden="true">🔎</div>
        <h2 className="text-2xl font-bold text-gray-800">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
