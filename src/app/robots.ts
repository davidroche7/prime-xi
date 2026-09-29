import type { MetadataRoute } from "next";
import { IS_DEMO_HOST, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // GitHub Pages demo mirror: keep crawlers out entirely (belt-and-braces with
  // the per-page noindex meta) so it never competes with prod for rankings.
  if (IS_DEMO_HOST) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
