import type { MetadataRoute } from "next";
import { getEras } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/daily/`, changeFrequency: "daily", priority: 0.9 },
    ...getEras("liverpool").map((e) => ({
      url: `${SITE_URL}/xi/${e.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/privacy/`, changeFrequency: "yearly" as const, priority: 0.1 },
    { url: `${SITE_URL}/terms/`, changeFrequency: "yearly" as const, priority: 0.1 },
  ];
}
