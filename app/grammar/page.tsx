import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/content";
import { CATEGORIES, LEVEL_LABELS } from "@/lib/constants";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "スペイン語文法解説 - レベル別完全ガイド",
  description: CATEGORIES.grammar.description,
};

export default function GrammarListPage() {
  const articles = getArticlesByCategory("grammar");

  // Group by level
  const levels = ["a1", "a2", "b1", "b2", "c1", "c2"];
  const grouped = levels
    .map((level) => ({
      level,
      label: LEVEL_LABELS[level],
      articles: articles.filter((a) => a.level === level),
    }))
    .filter((g) => g.articles.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        スペイン語文法解説
      </h1>
      <p className="text-gray-600 mb-10">{CATEGORIES.grammar.description}</p>

      {grouped.map((group) => (
        <section key={group.level} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
