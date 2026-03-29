import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllVocabData,
  getVocabData,
  getRelatedArticles,
  getAllArticles,
} from "@/lib/content";
import { SITE_URL, LEVEL_LABELS, CATEGORIES } from "@/lib/constants";
import Sidebar from "@/components/Sidebar";
import AppCTA from "@/components/AppCTA";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  return getAllVocabData().map((v) => ({
    slug: v.level,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vocab = getVocabData(slug);
  if (!vocab) return {};
  const title = `DELE ${vocab.level.toUpperCase()} 頻出単語${vocab.totalWords}選 - 例文付き`;
  const description = `DELE ${vocab.level.toUpperCase()}レベルの頻出単語${vocab.totalWords}語を例文付きで紹介。カテゴリ別に整理して効率的に学習。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/vocabulary/${slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/vocabulary/${slug}`,
    },
  };
}

export default async function VocabularyArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vocab = getVocabData(slug);
  if (!vocab) notFound();

  const levelLabel = LEVEL_LABELS[vocab.level] || vocab.level.toUpperCase();
  const title = `DELE ${vocab.level.toUpperCase()} 頻出単語${vocab.totalWords}選 - 例文付き`;
  const url = `${SITE_URL}/vocabulary/${slug}`;
  const now = new Date().toISOString();

  // Show first 50 words across categories
  const sampleCategories = vocab.categories.slice(0, 8);

  const currentArticle = getAllArticles().find(
    (a) => a.category === "vocabulary" && a.slug === slug
  );
  const relatedArticles = currentArticle
    ? getRelatedArticles(currentArticle, 5)
    : [];

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={`DELE ${vocab.level.toUpperCase()}の頻出単語を例文付きで紹介。`}
        url={url}
        datePublished={now}
        dateModified={now}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          {
            name: CATEGORIES.vocabulary.nameJa,
            url: `${SITE_URL}/vocabulary`,
          },
          { name: `DELE ${vocab.level.toUpperCase()}`, url },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-spanish-red">
            ホーム
          </a>
          {" > "}
          <a href="/vocabulary" className="hover:text-spanish-red">
            DELE単語集
          </a>
          {" > "}
          <span className="text-gray-700">
            DELE {vocab.level.toUpperCase()}
          </span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <article className="prose max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
                  DELE単語集
                </span>
                <span className="text-xs font-medium text-amber-700 bg-spanish-yellow-light px-2 py-0.5 rounded">
                  {levelLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-gray-600 mt-3">
                DELE {vocab.level.toUpperCase()}
                レベルで頻出する単語を、カテゴリ別に整理しました。
                各単語には例文と日本語訳が付いています。
              </p>
            </div>

            {/* Summary box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
              <h2 className="font-bold text-sm text-gray-900 mb-2">
                この記事でわかること
              </h2>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  DELE {vocab.level.toUpperCase()} 頻出単語
                  {vocab.totalWords}語
                </li>
                <li>カテゴリ別に整理された単語リスト</li>
                <li>各単語の例文と日本語訳</li>
                <li>よくある間違い・注意点</li>
              </ul>
            </div>

            {/* Categories */}
            {sampleCategories.map((cat) => (
              <section key={cat.categoryId} className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  {cat.categoryJa}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {cat.categoryEs}
                  </span>
                </h2>
                <div className="space-y-3">
                  {cat.words.slice(0, 8).map((word) => (
                    <div
                      key={word.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-lg font-bold text-spanish-red">
                          {word.word}
                        </span>
                        <span className="text-sm text-gray-500">
                          {word.meaningJa}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({word.partOfSpeech}
                          {word.gender ? `, ${word.gender}` : ""})
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{word.exampleEs}</span>
                      </p>
                      <p className="text-sm text-gray-600">{word.exampleJa}</p>
                      {word.commonMistakeJa && (
                        <p className="text-xs text-amber-700 mt-2 italic">
                          ⚠️ {word.commonMistakeJa}
                        </p>
                      )}
                    </div>
                  ))}
                  {cat.words.length > 8 && (
                    <p className="text-sm text-gray-500 italic">
                      ...他 {cat.words.length - 8}{" "}
                      語はアプリで学習できます
                    </p>
                  )}
                </div>
              </section>
            ))}

            {vocab.categories.length > 8 && (
              <p className="text-gray-500 italic">
                他 {vocab.categories.length - 8}{" "}
                カテゴリはアプリで学習できます。
              </p>
            )}

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
