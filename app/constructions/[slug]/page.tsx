import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getConstructionsData,
  getConstructionCategory,
  getRelatedArticles,
  getAllArticles,
} from "@/lib/content";
import { SITE_URL, LEVEL_LABELS, CATEGORIES } from "@/lib/constants";
import Sidebar from "@/components/Sidebar";
import AppCTA from "@/components/AppCTA";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const data = getConstructionsData();
  return data.categories.map((cat) => ({
    slug: cat.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getConstructionCategory(slug);
  if (!cat) return {};
  const title = `スペイン語の${cat.nameJa}構文パターン${cat.constructions.length}選`;
  const description = `スペイン語で${cat.nameJa}を表す構文パターン${cat.constructions.length}個を例文付きで徹底解説。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/constructions/${slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/constructions/${slug}`,
    },
  };
}

export default async function ConstructionsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getConstructionCategory(slug);
  if (!cat) notFound();

  const title = `スペイン語の${cat.nameJa}構文パターン${cat.constructions.length}選`;
  const url = `${SITE_URL}/constructions/${slug}`;
  const now = new Date().toISOString();

  const currentArticle = getAllArticles().find(
    (a) => a.category === "constructions" && a.slug === slug
  );
  const relatedArticles = currentArticle
    ? getRelatedArticles(currentArticle, 5)
    : [];

  const tocItems = cat.constructions.map((con, i) => ({
    id: `con-${i}`,
    text: `${con.pattern}（${con.meaningJa}）`,
    level: 2,
  }));

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={`スペイン語の${cat.nameJa}構文パターンを解説。`}
        url={url}
        datePublished={now}
        dateModified={now}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          {
            name: CATEGORIES.constructions.nameJa,
            url: `${SITE_URL}/constructions`,
          },
          { name: cat.nameJa, url },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-spanish-red">
            ホーム
          </a>
          {" > "}
          <a href="/constructions" className="hover:text-spanish-red">
            構文パターン
          </a>
          {" > "}
          <span className="text-gray-700">{cat.nameJa}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <article className="prose max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
                  構文パターン
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-gray-600 mt-3">{cat.nameEs}</p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
              <h2 className="font-bold text-sm text-gray-900 mb-2">
                この記事でわかること
              </h2>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  {cat.nameJa}を表す構文パターン{cat.constructions.length}個
                </li>
                <li>各構文の使い分け・ニュアンスの違い</li>
                <li>よくある間違いと注意点</li>
                <li>レベル別の学習順序</li>
              </ul>
            </div>

            {/* TOC */}
            <nav className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
              <h2 className="font-bold text-sm text-gray-900 mb-3">
                この記事の内容
              </h2>
              <ol className="space-y-1.5 text-sm">
                {tocItems.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-600 hover:text-spanish-red transition-colors"
                    >
                      {i + 1}. {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Constructions */}
            {cat.constructions.map((con, i) => {
              const conLevel =
                LEVEL_LABELS[con.level] || con.level.toUpperCase();
              return (
                <section key={con.id} className="mb-10">
                  <h2
                    id={`con-${i}`}
                    className="text-xl font-bold text-gray-900 mb-1 pb-2 border-b border-gray-100"
                  >
                    {con.pattern}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">
                      {con.meaningJa}
                    </span>
                    <span className="text-xs font-medium text-amber-700 bg-spanish-yellow-light px-2 py-0.5 rounded">
                      {conLevel}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {con.explanation}
                  </p>

                  {/* Examples */}
                  <div className="space-y-2 mb-4">
                    {con.examples.map((ex, j) => (
                      <div
                        key={j}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <p className="font-medium text-spanish-red text-sm">
                          {ex.es}
                        </p>
                        <p className="text-sm text-gray-700">{ex.ja}</p>
                      </div>
                    ))}
                  </div>

                  {/* Common mistake */}
                  {con.commonMistakeJa && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-700">
                        ⚠️ {con.commonMistakeJa}
                      </p>
                    </div>
                  )}

                  {/* Related patterns */}
                  {con.relatedPatterns.length > 0 && (
                    <p className="text-xs text-gray-500">
                      関連:{" "}
                      {con.relatedPatterns.join("、")}
                    </p>
                  )}
                </section>
              );
            })}

            <AppCTA />
          </article>

          <div className="hidden lg:block mt-8 lg:mt-0">
            <Sidebar relatedArticles={relatedArticles} />
          </div>
        </div>
      </div>
    </>
  );
}
