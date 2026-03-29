// Content types matching the espanol-app JSON structures

export interface GrammarExample {
  es: string;
  ja: string;
  noteJa?: string;
}

export interface ConjugationTable {
  type: "conjugation_table";
  verb: string;
  tense: string;
  forms: Record<string, string>;
  latamNote?: string | null;
  spainNote?: string | null;
}

export interface ExplanationSection {
  type: "explanation";
  headingJa: string;
  bodyJa: string;
  bodyEs?: string;
}

export interface ExamplesSection {
  type: "examples";
  items: GrammarExample[];
}

export interface CommonMistake {
  wrong: string;
  correct: string;
  whyJa: string;
}

export interface CommonMistakesSection {
  type: "common_mistakes";
  items: CommonMistake[];
}

export interface RealExample {
  es: string;
  ja: string;
  source: string;
  sourceLabel: string;
  context: string;
  noteJa: string;
}

export interface RealExamplesSection {
  type: "real_examples";
  headingJa: string;
  items: RealExample[];
}

export type GrammarSection =
  | ExplanationSection
  | ConjugationTable
  | ExamplesSection
  | CommonMistakesSection
  | RealExamplesSection;

export interface GrammarLesson {
  id: string;
  slug: string;
  titleJa: string;
  titleEs: string;
  level: string;
  sortOrder: number;
  content: {
    sections: GrammarSection[];
  };
}

export interface VocabWord {
  id: string;
  word: string;
  meaningJa: string;
  partOfSpeech: string;
  gender: string | null;
  exampleEs: string;
  exampleJa: string;
  relatedWords: string[];
  commonMistakeJa: string | null;
  deleLevel: string;
}

export interface VocabCategory {
  categoryId: string;
  categoryJa: string;
  categoryEs: string;
  words: VocabWord[];
}

export interface VocabData {
  level: string;
  totalWords: number;
  categories: VocabCategory[];
}

export interface Phrase {
  id: string;
  spanishText: string;
  japaneseTranslation: string;
  pronunciationHint: string;
  formality: string;
  spainVariant: string | null;
  latamVariant: string | null;
  contextNoteJa: string;
  category: string;
}

export interface PhraseData {
  scenario: string;
  titleJa: string;
  titleEs: string;
  totalPhrases: number;
  phrases: Phrase[];
}

export interface ConstructionExample {
  es: string;
  ja: string;
}

export interface Construction {
  id: string;
  pattern: string;
  meaningJa: string;
  level: string;
  explanation: string;
  examples: ConstructionExample[];
  commonMistakeJa: string;
  relatedPatterns: string[];
}

export interface ConstructionCategory {
  id: string;
  nameJa: string;
  nameEs: string;
  constructions: Construction[];
}

export interface ConstructionsData {
  title: string;
  totalConstructions: number;
  categories: ConstructionCategory[];
}

// Blog article types
export interface ArticleMeta {
  slug: string;
  category: "grammar" | "vocabulary" | "phrases" | "constructions";
  title: string;
  description: string;
  level?: string;
  keywords: string[];
  lastModified: string;
}
