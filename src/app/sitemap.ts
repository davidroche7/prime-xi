import type { MetadataRoute } from "next";
import { getClubSlugs } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/daily/`, changeFrequency: "daily", priority: 0.9 },
    ...getClubSlugs().map((slug) => ({
      url: `${SITE_URL}/club/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
