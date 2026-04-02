import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { CATEGORIES, LEVEL_LABELS } from "@/lib/constants";

export default function RelatedArticlesInBody({
  articles,
}: {
  articles: ArticleMeta[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="my-10 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        あわせて読みたい関連記事
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((a) => {
          const levelLabel =
            a.level && LEVEL_LABELS[a.level]
              ? LEVEL_LABELS[a.level]
              : undefined;

          return (
            <Link
              key={`${a.category}-${a.slug}`}
              href={`/${a.category}/${a.slug}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-spanish-red hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
                  {CATEGORIES[a.category].nameJa}
                </span>
                {levelLabel && (
                  <span className="text-xs font-medium text-amber-700 bg-spanish-yellow-light px-2 py-0.5 rounded">
                    {levelLabel}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-spanish-red transition-colors leading-snug">
                {a.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {a.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
