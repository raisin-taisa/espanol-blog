import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { CATEGORIES, APP_URL } from "@/lib/constants";
import ArticleCard from "@/components/ArticleCard";

export default function HomePage() {
  const articles = getAllArticles();

  const grouped = {
    grammar: articles.filter((a) => a.category === "grammar"),
    vocabulary: articles.filter((a) => a.category === "vocabulary"),
    phrases: articles.filter((a) => a.category === "phrases"),
    constructions: articles.filter((a) => a.category === "constructions"),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          日本人のためのスペイン語学習ブログ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          文法・DELE対策単語・実用フレーズ・構文パターンを
          日本語で丁寧に解説。初級から上級まで{articles.length}以上の記事。
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-spanish-red text-white font-bold text-sm px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Español Masterアプリで学習する →
        </a>
      </section>

      {/* Category sections */}
      {(
        Object.entries(CATEGORIES) as [
          keyof typeof CATEGORIES,
          (typeof CATEGORIES)[keyof typeof CATEGORIES],
        ][]
      ).map(([key, cat]) => {
        const catArticles = grouped[key];
        if (catArticles.length === 0) return null;
        return (
          <section key={key} className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {cat.nameJa}
              </h2>
              <Link
                href={`/${cat.slug}`}
                className="text-sm text-spanish-red font-medium hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catArticles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={`${article.category}-${article.slug}`}
                  article={article}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
