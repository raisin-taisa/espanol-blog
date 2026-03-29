import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/content";
import { CATEGORIES } from "@/lib/constants";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "スペイン語フレーズ集 - シーン別",
  description: CATEGORIES.phrases.description,
};

export default function PhrasesListPage() {
  const articles = getArticlesByCategory("phrases");

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        スペイン語フレーズ集
      </h1>
      <p className="text-gray-600 mb-10">{CATEGORIES.phrases.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
