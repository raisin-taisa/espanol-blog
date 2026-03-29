/**
 * Content Sync Script
 *
 * Reads JSON files from espanol-app/content/ and generates a manifest
 * for the blog. The blog reads directly from the app's content directory
 * at build time, so this script mainly validates and reports content stats.
 *
 * Usage: npx tsx scripts/sync-content.ts
 */

import fs from "fs";
import path from "path";

const APP_CONTENT_DIR = path.resolve(
  __dirname,
  "../../espanol-app/content"
);

interface ContentStats {
  grammar: { level: string; count: number; slugs: string[] }[];
  vocabulary: { level: string; totalWords: number }[];
  phrases: { scenario: string; totalPhrases: number }[];
  constructions: { category: string; count: number }[];
  totalArticles: number;
}

function syncContent(): ContentStats {
  const stats: ContentStats = {
    grammar: [],
    vocabulary: [],
    phrases: [],
    constructions: [],
    totalArticles: 0,
  };

  // Grammar
  const grammarDir = path.join(APP_CONTENT_DIR, "grammar");
  if (fs.existsSync(grammarDir)) {
    const levels = fs
      .readdirSync(grammarDir)
      .filter((d) =>
        fs.statSync(path.join(grammarDir, d)).isDirectory()
      );

    for (const level of levels) {
      const levelDir = path.join(grammarDir, level);
      const files = fs
        .readdirSync(levelDir)
        .filter((f) => f.endsWith(".json"));
      const slugs: string[] = [];

      for (const file of files) {
        const data = JSON.parse(
          fs.readFileSync(path.join(levelDir, file), "utf-8")
        );
        slugs.push(data.slug);
      }

      stats.grammar.push({ level, count: files.length, slugs });
      stats.totalArticles += files.length;
    }
  }

  // Vocabulary
  const vocabDir = path.join(APP_CONTENT_DIR, "dele-vocab");
  if (fs.existsSync(vocabDir)) {
    const files = fs
      .readdirSync(vocabDir)
      .filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const data = JSON.parse(
        fs.readFileSync(path.join(vocabDir, file), "utf-8")
      );
      const level = data.level || data.deleLevel;
      stats.vocabulary.push({
        level,
        totalWords: data.totalWords,
      });
      stats.totalArticles += 1;
    }
  }

  // Phrases (exclude adult content)
  const excludedScenarios = [
    "adult-sexual",
    "adult-intimate",
    "adult-life",
  ];
  const phraseDir = path.join(APP_CONTENT_DIR, "phrases");
  if (fs.existsSync(phraseDir)) {
    const files = fs
      .readdirSync(phraseDir)
      .filter(
        (f) =>
          f.endsWith(".json") &&
          !excludedScenarios.some((exc) => f.startsWith(exc))
      );

    for (const file of files) {
      const data = JSON.parse(
        fs.readFileSync(path.join(phraseDir, file), "utf-8")
      );
      stats.phrases.push({
        scenario: data.scenario,
        totalPhrases: data.totalPhrases,
      });
      stats.totalArticles += 1;
    }
  }

  // Constructions
  const constructionsFile = path.join(
    APP_CONTENT_DIR,
    "constructions.json"
  );
  if (fs.existsSync(constructionsFile)) {
    const data = JSON.parse(
      fs.readFileSync(constructionsFile, "utf-8")
    );
    for (const cat of data.categories) {
      stats.constructions.push({
        category: cat.nameJa,
        count: cat.constructions.length,
      });
      stats.totalArticles += 1;
    }
  }

  return stats;
}

// Run
const stats = syncContent();

console.log("\n=== Español Master Blog - Content Sync ===\n");
console.log(`Total articles: ${stats.totalArticles}\n`);

console.log("Grammar:");
for (const g of stats.grammar) {
  console.log(
    `  ${g.level.toUpperCase()}: ${g.count} articles (${g.slugs.join(", ")})`
  );
}

console.log("\nVocabulary:");
for (const v of stats.vocabulary) {
  console.log(
    `  DELE ${v.level.toUpperCase()}: ${v.totalWords} words`
  );
}

console.log("\nPhrases:");
for (const p of stats.phrases) {
  console.log(`  ${p.scenario}: ${p.totalPhrases} phrases`);
}

console.log("\nConstructions:");
for (const c of stats.constructions) {
  console.log(`  ${c.category}: ${c.count} patterns`);
}

console.log("\n✓ Content sync complete.");

// Write manifest
const manifestPath = path.resolve(__dirname, "../content/manifest.json");
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(stats, null, 2));
console.log(`\nManifest written to: ${manifestPath}`);
