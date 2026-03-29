import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPhraseData,
  getPhraseData,
  getRelatedArticles,
  getAllArticles,
} from "@/lib/content";
import { SITE_URL, CATEGORIES } from "@/lib/constants";
import Sidebar from "@/components/Sidebar";
import AppCTA from "@/components/AppCTA";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  return getAllPhraseData().map((p) => ({
    slug: p.scenario,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getPhraseData(slug);
  if (!data) return {};
  const title = `スペイン語 ${data.titleJa.replace(/で使えるスペイン語フレーズ|スペイン語フレーズ集/, "")}フレーズ${data.totalPhrases}選`;
  const description = `${data.titleJa}。発音ガイド・文化背景付き。すぐに使える実践フレーズを厳選。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/phrases/${slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/phrases/${slug}`,
    },
  };
}

export default async function PhrasesArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getPhraseData(slug);
  if (!data) notFound();

  const title = `スペイン語 ${data.titleJa.replace(/で使えるスペイン語フレーズ|スペイン語フレーズ集/, "")}フレーズ${data.totalPhrases}選`;
  const url = `${SITE_URL}/phrases/${slug}`;
  const now = new Date().toISOString();

  // Group phrases by category
  const categories = new Map<string, typeof data.phrases>();
  for (const phrase of data.phrases) {
    const cat = phrase.category || "general";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(phrase);
  }

  const currentArticle = getAllArticles().find(
    (a) => a.category === "phrases" && a.slug === slug
  );
  const relatedArticles = currentArticle
    ? getRelatedArticles(currentArticle, 5)
    : [];

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={`${data.titleJa}。発音ガイド付き。`}
        url={url}
        datePublished={now}
        dateModified={now}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: CATEGORIES.phrases.nameJa, url: `${SITE_URL}/phrases` },
          { name: data.titleJa, url },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-spanish-red">
            ホーム
          </a>
          {" > "}
          <a href="/phrases" className="hover:text-spanish-red">
            フレーズ集
          </a>
          {" > "}
          <span className="text-gray-700">{data.titleJa}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <article className="prose max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
                  フレーズ集
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="text-gray-600 mt-3">{data.titleEs}</p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
              <h2 className="font-bold text-sm text-gray-900 mb-2">
                この記事でわかること
              </h2>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  {data.scenario}シーンで使える厳選フレーズ
                  {data.totalPhrases}個
                </li>
                <li>各フレーズの発音ガイド付き</li>
                <li>フォーマル/カジュアルの使い分け</li>
                <li>スペインと中南米の違い</li>
              </ul>
            </div>

            {/* Phrases by category */}
            {Array.from(categories.entries()).map(([cat, phrases]) => (
              <section key={cat} className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 capitalize">
                  {cat.replace(/_/g, " ")}
                </h2>
                <div className="space-y-4">
                  {phrases.map((phrase) => (
                    <div
                      key={phrase.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <p className="text-lg font-bold text-spanish-red">
                        {phrase.spanishText}
                      </p>
                      <p className="text-gray-700 mt-1">
                        {phrase.japaneseTranslation}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        🔊 {phrase.pronunciationHint}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            phrase.formality === "formal"
                              ? "bg-blue-50 text-blue-700"
                              : phrase.formality === "informal"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {phrase.formality === "formal"
                            ? "丁寧"
                            : phrase.formality === "informal"
                              ? "カジュアル"
                              : "標準"}
                        </span>
                      </div>
                      {phrase.contextNoteJa && (
                        <p className="text-sm text-gray-600 mt-2">
                          💡 {phrase.contextNoteJa}
                        </p>
                      )}
                      {phrase.latamVariant && (
                        <p className="text-xs text-gray-500 mt-1">
                          🌎 中南米: {phrase.latamVariant}
                        </p>
                      )}
                      {phrase.spainVariant && (
                        <p className="text-xs text-gray-500 mt-1">
                          🇪🇸 スペイン: {phrase.spainVariant}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

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
