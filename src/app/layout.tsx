import type { Metadata } from "next";
import Link from "next/link";
import { DISCLAIMER, PLAUSIBLE_DOMAIN, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Pick a club, spend a fixed budget on peak player-seasons, and see how your greatest XI rates. Deterministic scoring, a daily puzzle, and shareable team cards.",
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
              PRIME<span className="text-emerald-400"> XI</span>
            </Link>
            <div className="flex gap-4 text-sm text-zinc-300">
              <Link href="/daily/" className="hover:text-white">
                Daily puzzle
              </Link>
              <Link href="/" className="hover:text-white">
                Clubs
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-ink-800 py-6">
          <div className="mx-auto max-w-5xl px-4 text-xs leading-relaxed text-zinc-500">
            <p>{DISCLAIMER}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
