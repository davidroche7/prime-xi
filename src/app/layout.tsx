import type { Metadata } from "next";
import Link from "next/link";
import { CREDITS, DISCLAIMER, PLAUSIBLE_DOMAIN, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "The Perfect XI — build the greatest Liverpool team blind and score it /98 against a hidden canonical selection — plus Guess the Red, the daily player quiz.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Build the greatest Liverpool XI blind and score it /98 against a hidden canonical selection. Plus a daily player quiz.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {PLAUSIBLE_DOMAIN ? (
          <script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-ink-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-black tracking-tight">
              PRIME<span className="text-red-500"> XI</span>
            </Link>
            <div className="flex gap-4 text-sm text-zinc-300">
              <Link href="/" className="hover:text-white">
                The Perfect XI
              </Link>
              <Link href="/daily/" className="hover:text-white">
                Daily quiz
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-ink-800 py-6">
          <div className="mx-auto max-w-5xl space-y-2 px-4 text-xs leading-relaxed text-zinc-500">
            <p>{DISCLAIMER}</p>
            <p>{CREDITS}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
