import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        ページが見つかりません
      </h2>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-block bg-spanish-red text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
