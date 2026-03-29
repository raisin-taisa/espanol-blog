import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllGrammarLessons,
  getGrammarLesson,
  getRelatedArticles,
  getAllArticles,
} from "@/lib/content";
import { SITE_URL, LEVEL_LABELS, CATEGORIES } from "@/lib/constants";
import type {
  ExplanationSection,
  ConjugationTable,
  ExamplesSection,
  CommonMistakesSection,
  RealExamplesSection,
} from "@/lib/types";
import TableOfContents from "@/components/TableOfContents";
import Sidebar from "@/components/Sidebar";
import AppCTA from "@/components/AppCTA";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  return getAllGrammarLessons().map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getGrammarLesson(slug);
  if (!lesson) return {};
  const levelLabel = LEVEL_LABELS[lesson.level] || lesson.level.toUpperCase();
  const title = `スペイン語の${lesson.titleJa} - ${levelLabel}レベル完全解説`;
  const description = `スペイン語の${lesson.titleJa}を日本語で徹底解説。例文・よくある間違い・ネイティブの使い方まで。DELE ${lesson.level.toUpperCase()}対策にも。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/grammar/${slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/grammar/${slug}`,
    },
  };
}

export default async function GrammarArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getGrammarLesson(slug);
  if (!lesson) notFound();

  const levelLabel = LEVEL_LABELS[lesson.level] || lesson.level.toUpperCase();
  const title = `スペイン語の${lesson.titleJa} - ${levelLabel}レベル完全解説`;
  const url = `${SITE_URL}/grammar/${slug}`;
  const now = new Date().toISOString();

  // Build TOC from sections
  const tocItems = lesson.content.sections
    .filter(
      (s): s is ExplanationSection | CommonMistakesSection | RealExamplesSection =>
        s.type === "explanation" || s.type === "common_mistakes" || s.type === "real_examples"
    )
    .map((s, i) => {
      const id = `section-${i}`;
      let text = "";
      if (s.type === "explanation") text = s.headingJa;
      else if (s.type === "common_mistakes") text = "よくある間違い";
      else if (s.type === "real_examples") text = s.headingJa;
      return { id, text, level: 2 };
    });

  const currentArticle = getAllArticles().find(
    (a) => a.category === "grammar" && a.slug === slug
  );
  const relatedArticles = currentArticle
    ? getRelatedArticles(currentArticle, 5)
    : [];

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={`スペイン語の${lesson.titleJa}を日本語で徹底解説。`}
        url={url}
        datePublished={now}
        dateModified={now}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: CATEGORIES.grammar.nameJa, url: `${SITE_URL}/grammar` },
          { name: lesson.titleJa, url },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-spanish-red">
            ホーム
          </a>
          {" > "}
          <a href="/grammar" className="hover:text-spanish-red">
            文法解説
          </a>
          {" > "}
          <span className="text-gray-700">{lesson.titleJa}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <article className="prose max-w-none">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-spanish-red bg-spanish-red-light px-2 py-0.5 rounded">
                  文法解説
                </span>
                <span className="text-xs font-medium text-amber-700 bg-spanish-yellow-light px-2 py-0.5 rounded">
                  {levelLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="mt-3 text-gray-600">
                {lesson.titleEs}
              </p>
            </div>

            <TableOfContents items={tocItems} />

            {/* Sections */}
            {lesson.content.sections.map((section, i) => {
              const sectionId = `section-${i}`;

              if (section.type === "explanation") {
                return (
                  <ExplanationBlock
                    key={sectionId}
                    id={sectionId}
                    section={section}
                  />
                );
              }

              if (section.type === "conjugation_table") {
                return (
                  <ConjugationBlock key={sectionId} section={section} />
                );
              }

              if (section.type === "examples") {
                return (
                  <ExamplesBlock key={sectionId} section={section} />
                );
              }

              if (section.type === "common_mistakes") {
                return (
                  <CommonMistakesBlock
                    key={sectionId}
                    id={sectionId}
                    section={section}
                  />
                );
              }

              if (section.type === "real_examples") {
                return (
                  <RealExamplesBlock
                    key={sectionId}
                    id={sectionId}
                    section={section}
                  />
                );
              }

              return null;
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

function ExplanationBlock({
  id,
  section,
}: {
  id: string;
  section: ExplanationSection;
}) {
  return (
    <section className="mb-8">
      <h2
        id={id}
        className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100"
      >
        {section.headingJa}
      </h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {section.bodyJa}
      </div>
    </section>
  );
}

function ConjugationBlock({ section }: { section: ConjugationTable }) {
  return (
    <div className="mb-8 overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        {section.verb} - {section.tense}
      </h3>
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-spanish-red-light">
            <th className="text-left px-4 py-2 font-medium text-gray-700">
              主語
            </th>
            <th className="text-left px-4 py-2 font-medium text-gray-700">
              活用形
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(section.forms).map(([pronoun, form]) => (
            <tr key={pronoun} className="border-t border-gray-100">
              <td className="px-4 py-2 text-gray-600">{pronoun}</td>
              <td className="px-4 py-2 font-medium text-spanish-red">
                {form}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {section.latamNote && (
        <p className="mt-2 text-xs text-gray-500 italic">
          🌎 {section.latamNote}
        </p>
      )}
    </div>
  );
}

function ExamplesBlock({ section }: { section: ExamplesSection }) {
  return (
    <div className="mb-8 space-y-3">
      <h3 className="text-lg font-bold text-gray-800 mb-3">例文</h3>
      {section.items.map((ex, i) => (
        <div
          key={i}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <p className="font-medium text-spanish-red">{ex.es}</p>
          <p className="text-gray-700 mt-1">{ex.ja}</p>
          {ex.noteJa && (
            <p className="text-xs text-gray-500 mt-2 italic">
              💡 {ex.noteJa}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CommonMistakesBlock({
  id,
  section,
}: {
  id: string;
  section: CommonMistakesSection;
}) {
  return (
    <section className="mb-8">
      <h2
        id={id}
        className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100"
      >
        よくある間違い
      </h2>
      <div className="space-y-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="border border-red-200 bg-red-50 rounded-lg p-4"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-red-500 font-bold text-sm shrink-0">
                ✗
              </span>
              <p className="text-red-700 line-through">{item.wrong}</p>
            </div>
            <div className="flex items-start gap-3 mb-2">
              <span className="text-green-600 font-bold text-sm shrink-0">
                ✓
              </span>
              <p className="text-green-700 font-medium">{item.correct}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">{item.whyJa}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RealExamplesBlock({
  id,
  section,
}: {
  id: string;
  section: RealExamplesSection;
}) {
  return (
    <section className="mb-8">
      <h2
        id={id}
        className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100"
      >
        {section.headingJa}
      </h2>
      <div className="space-y-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="border border-amber-200 bg-spanish-yellow-light rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {item.sourceLabel}
              </span>
            </div>
            <p className="font-medium text-gray-900">{item.es}</p>
            <p className="text-gray-700 mt-1">{item.ja}</p>
            <p className="text-xs text-gray-500 mt-2">{item.context}</p>
            {item.noteJa && (
              <p className="text-xs text-gray-600 mt-1 italic">
                💡 {item.noteJa}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
