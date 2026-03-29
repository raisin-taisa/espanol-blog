import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { CATEGORIES, LEVEL_LABELS } from "@/lib/constants";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const category = CATEGORIES[article.category];
  const levelLabel = article.level
    ? LEVEL_LABELS[article.level] || article.level.toUpperCase()
    : null;

  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="block group border border-gray-200 rounded-lg p-5 hover:border-spanish-red/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
          {category.nameJa}
        </span>
        {levelLabel && (
          <span className="text-xs font-medium text-amber-700 bg-spanish-yellow-light px-2 py-0.5 rounded">
            {levelLabel}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-900 group-hover:text-spanish-red transition-colors leading-snug mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {article.description}
      </p>
    </Link>
  );
}
