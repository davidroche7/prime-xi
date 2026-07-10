import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-static";

const bp = process.env.BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description:
      "Build the greatest Liverpool XI blind, score it /98, and take it head-to-head against Europe's biggest clubs. Plus a daily player quiz.",
    start_url: `${bp}/`,
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: `${bp}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${bp}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${bp}/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
