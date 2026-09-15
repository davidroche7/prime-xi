import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the static export (`out/`) for app-store distribution. No native code,
// no server — same build output that ships to Cloudflare Pages. Rebuild with
// `pnpm build && pnpm cap sync` before every store submission.
const config: CapacitorConfig = {
  appId: "com.theperfectxi.app",
  appName: "The Perfect XI",
  webDir: "out",
};

export default config;
