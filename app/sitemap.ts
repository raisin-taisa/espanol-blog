import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const now = new Date();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/${article.category}/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = [
    "grammar",
    "vocabulary",
    "phrases",
    "constructions",
  ].map((cat) => ({
    url: `${SITE_URL}/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
