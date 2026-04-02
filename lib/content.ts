import fs from "fs";
import path from "path";
import type {
  GrammarLesson,
  VocabData,
  PhraseData,
  ConstructionsData,
  ArticleMeta,
} from "./types";
import { LEVEL_LABELS } from "./constants";

const CONTENT_DIR = path.join(process.cwd(), "content");
const APP_CONTENT_DIR = CONTENT_DIR;

// --------------- Grammar ---------------

function getGrammarFiles(): string[] {
  const grammarDir = path.join(APP_CONTENT_DIR, "grammar");
  if (!fs.existsSync(grammarDir)) return [];
  const levels = fs.readdirSync(grammarDir).filter((d) => {
    const fullPath = path.join(grammarDir, d);
    return fs.statSync(fullPath).isDirectory();
  });
  const files: string[] = [];
  for (const level of levels) {
    const levelDir = path.join(grammarDir, level);
    const jsonFiles = fs
      .readdirSync(levelDir)
      .filter((f) => f.endsWith(".json"));
    for (const f of jsonFiles) {
      files.push(path.join(levelDir, f));
    }
  }
  return files;
}

export function getAllGrammarLessons(): GrammarLesson[] {
  return getGrammarFiles().map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as GrammarLesson;
  });
}

export function getGrammarLesson(slug: string): GrammarLesson | null {
  const lessons = getAllGrammarLessons();
  return lessons.find((l) => l.slug === slug) ?? null;
}

// --------------- Vocabulary ---------------

function getVocabFiles(): string[] {
  const vocabDir = path.join(APP_CONTENT_DIR, "dele-vocab");
  if (!fs.existsSync(vocabDir)) return [];
  return fs
    .readdirSync(vocabDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(vocabDir, f));
}

export function getAllVocabData(): VocabData[] {
  return getVocabFiles().map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    // Some files use "deleLevel" instead of "level"
    if (!data.level && data.deleLevel) {
      data.level = data.deleLevel;
    }
    return data as VocabData;
  });
}

export function getVocabData(level: string): VocabData | null {
  const all = getAllVocabData();
  return all.find((v) => v.level === level) ?? null;
}

// --------------- Phrases ---------------

const EXCLUDED_PHRASE_SCENARIOS = [
  "adult-sexual",
  "adult-intimate",
  "adult-life",
];

function getPhraseFiles(): string[] {
  const phraseDir = path.join(APP_CONTENT_DIR, "phrases");
  if (!fs.existsSync(phraseDir)) return [];
  return fs
    .readdirSync(phraseDir)
    .filter(
      (f) =>
        f.endsWith(".json") &&
        !EXCLUDED_PHRASE_SCENARIOS.some((exc) => f.startsWith(exc))
    )
    .map((f) => path.join(phraseDir, f));
}

export function getAllPhraseData(): PhraseData[] {
  return getPhraseFiles().map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as PhraseData;
  });
}

export function getPhraseData(scenario: string): PhraseData | null {
  const all = getAllPhraseData();
  return all.find((p) => p.scenario === scenario) ?? null;
}

// --------------- Constructions ---------------

export function getConstructionsData(): ConstructionsData {
  const filePath = path.join(APP_CONTENT_DIR, "constructions.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ConstructionsData;
}

export function getConstructionCategory(
  categoryId: string
): ConstructionsData["categories"][number] | null {
  const data = getConstructionsData();
  return data.categories.find((c) => c.id === categoryId) ?? null;
}

// --------------- Article Index ---------------

export function getAllArticles(): ArticleMeta[] {
  const articles: ArticleMeta[] = [];
  const now = new Date().toISOString();

  // Grammar articles
  for (const lesson of getAllGrammarLessons()) {
    const levelLabel = LEVEL_LABELS[lesson.level] || lesson.level.toUpperCase();
    articles.push({
      slug: lesson.slug,
      category: "grammar",
      title: `スペイン語の${lesson.titleJa} - ${levelLabel}レベル完全解説`,
      description: `スペイン語の${lesson.titleJa}を日本語で徹底解説。例文・よくある間違い・ネイティブの使い方まで。DELE ${lesson.level.toUpperCase()}対策にも。`,
      level: lesson.level,
      keywords: [
        `スペイン語 ${lesson.titleJa}`,
        `スペイン語 ${lesson.slug.replace(/-/g, " ")}`,
        `DELE ${lesson.level.toUpperCase()} 文法`,
      ],
      lastModified: now,
    });
  }

  // Vocabulary articles
  for (const vocab of getAllVocabData()) {
    const levelLabel = LEVEL_LABELS[vocab.level] || vocab.level.toUpperCase();
    articles.push({
      slug: vocab.level,
      category: "vocabulary",
      title: `DELE ${vocab.level.toUpperCase()} 頻出単語${vocab.totalWords}選 - 例文付き`,
      description: `DELE ${vocab.level.toUpperCase()}レベルの頻出単語${vocab.totalWords}語を例文付きで紹介。${levelLabel}の語彙力を強化しよう。`,
      level: vocab.level,
      keywords: [
        `DELE ${vocab.level.toUpperCase()} 単語`,
        `スペイン語 ${levelLabel} 語彙`,
        `DELE ${vocab.level.toUpperCase()} 対策`,
      ],
      lastModified: now,
    });
  }

  // Phrase articles
  for (const phrase of getAllPhraseData()) {
    articles.push({
      slug: phrase.scenario,
      category: "phrases",
      title: `スペイン語 ${phrase.titleJa.replace(/で使えるスペイン語フレーズ|スペイン語フレーズ集/, "")}フレーズ${phrase.totalPhrases}選`,
      description: `${phrase.titleJa}。発音ガイド・文化的な背景知識付きで実践的に学べます。`,
      keywords: [
        `スペイン語 ${phrase.scenario.replace(/_/g, " ")} フレーズ`,
        phrase.titleJa,
      ],
      lastModified: now,
    });
  }

  // Construction articles
  const constructions = getConstructionsData();
  for (const cat of constructions.categories) {
    articles.push({
      slug: cat.id,
      category: "constructions",
      title: `スペイン語の${cat.nameJa}構文パターン${cat.constructions.length}選`,
      description: `スペイン語の${cat.nameJa}を表す構文パターン${cat.constructions.length}個を解説。例文・よくある間違い付き。`,
      keywords: [
        `スペイン語 ${cat.nameJa} 構文`,
        `スペイン語 ${cat.nameJa} 表現`,
      ],
      lastModified: now,
    });
  }

  return articles;
}

export function getArticlesByCategory(
  category: ArticleMeta["category"]
): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getRelatedArticles(
  current: ArticleMeta,
  count: number = 5
): ArticleMeta[] {
  const all = getAllArticles().filter(
    (a) => !(a.slug === current.slug && a.category === current.category)
  );

  // Prefer same category, then same level
  const scored = all.map((a) => {
    let score = 0;
    if (a.category === current.category) score += 2;
    if (a.level && current.level && a.level === current.level) score += 1;
    return { article: a, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.article);
}

const LEVEL_ORDER = ["a1", "a2", "b1", "b2", "c1", "c2"];

function getAdjacentLevels(level: string): string[] {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx === -1) return [];
  const adj: string[] = [];
  if (idx > 0) adj.push(LEVEL_ORDER[idx - 1]);
  if (idx < LEVEL_ORDER.length - 1) adj.push(LEVEL_ORDER[idx + 1]);
  return adj;
}

/**
 * Cross-category contextual linking for in-body related articles.
 * Each article type gets links to complementary content types.
 */
export function getContextualRelatedArticles(
  currentSlug: string,
  category: ArticleMeta["category"],
  level?: string,
  count: number = 4
): ArticleMeta[] {
  const all = getAllArticles().filter(
    (a) => !(a.slug === currentSlug && a.category === category)
  );

  const scored = all.map((a) => {
    let score = 0;

    switch (category) {
      case "grammar":
        // Grammar articles link to: vocab of same level, grammar of adjacent levels, constructions
        if (a.category === "vocabulary" && a.level && a.level === level) {
          score += 5; // same-level vocab is highest priority
        } else if (a.category === "grammar" && a.level && level) {
          if (getAdjacentLevels(level).includes(a.level)) {
            score += 4; // adjacent-level grammar
          } else if (a.level === level) {
            score += 3; // same-level grammar
          }
        } else if (a.category === "constructions") {
          score += 2; // constructions are complementary
        }
        break;

      case "vocabulary":
        // Vocab articles link to: grammar of same level, grammar of adjacent levels
        if (a.category === "grammar" && a.level && level) {
          if (a.level === level) {
            score += 5;
          } else if (getAdjacentLevels(level).includes(a.level)) {
            score += 4;
          }
        } else if (a.category === "constructions") {
          score += 2;
        } else if (a.category === "phrases") {
          score += 1;
        }
        break;

      case "phrases":
        // Phrase articles link to: grammar articles and constructions
        if (a.category === "grammar") {
          score += 4;
        } else if (a.category === "constructions") {
          score += 3;
        } else if (a.category === "vocabulary") {
          score += 1;
        }
        break;

      case "constructions":
        // Construction articles link to: grammar articles covering same topics
        if (a.category === "grammar") {
          score += 4;
        } else if (a.category === "phrases") {
          score += 2;
        } else if (a.category === "vocabulary") {
          score += 1;
        }
        break;
    }

    return { article: a, score };
  });

  // Filter out zero-score articles, sort, and take top N
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.article);
}
