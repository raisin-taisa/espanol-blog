import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { CATEGORIES, APP_URL, APP_NAME } from "@/lib/constants";

export default function Sidebar({
  relatedArticles,
}: {
  relatedArticles: ArticleMeta[];
}) {
  return (
    <aside className="space-y-8">
      {/* Related articles */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">関連記事</h3>
        <ul className="space-y-3">
          {relatedArticles.map((a) => (
            <li key={`${a.category}-${a.slug}`}>
              <Link
                href={`/${a.category}/${a.slug}`}
                className="block text-sm text-gray-700 hover:text-spanish-red transition-colors leading-snug"
              >
                <span className="text-xs text-spanish-red font-medium">
                  {CATEGORIES[a.category].nameJa}
                </span>
                <br />
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* App promo */}
      <div className="bg-spanish-yellow-light border border-amber-200 rounded-lg p-5">
        <h3 className="font-bold text-gray-900 mb-2 text-sm">
          {APP_NAME}アプリ
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          文法・単語・フレーズをアプリで学習。クイズ機能付き。
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-bold text-spanish-red hover:underline"
        >
          アプリを試す →
        </a>
      </div>
    </aside>
  );
}
