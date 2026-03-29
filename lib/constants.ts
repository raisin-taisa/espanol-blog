export const SITE_NAME = "Español Master Blog";
export const SITE_DESCRIPTION =
  "日本人のためのスペイン語学習ブログ。文法解説、DELE対策単語集、実用フレーズ、構文パターンを網羅。";
export const SITE_URL = "https://espanol-master-blog.vercel.app";
export const APP_URL = "https://espanol-master-jp.vercel.app";
export const APP_NAME = "Español Master";

export const CATEGORIES = {
  grammar: {
    slug: "grammar",
    nameJa: "文法解説",
    description: "スペイン語文法をレベル別に完全解説。初級A1から上級C2まで。",
  },
  vocabulary: {
    slug: "vocabulary",
    nameJa: "DELE単語集",
    description: "DELE試験対策の頻出単語を例文付きで紹介。",
  },
  phrases: {
    slug: "phrases",
    nameJa: "フレーズ集",
    description:
      "旅行・レストラン・ビジネスなどシーン別スペイン語フレーズ集。",
  },
  constructions: {
    slug: "constructions",
    nameJa: "構文パターン",
    description:
      "スペイン語の重要構文パターンを体系的にまとめた完全ガイド。",
  },
} as const;

export const LEVEL_LABELS: Record<string, string> = {
  a1: "A1（入門）",
  a2: "A2（初級）",
  b1: "B1（中級）",
  b2: "B2（中上級）",
  c1: "C1（上級）",
  c2: "C2（最上級）",
};
