import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import Link from "next/link";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/flags";
import { CREDITS, DISCLAIMER, PLAUSIBLE_DOMAIN, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const bp = process.env.BASE_PATH || "";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });

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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#09090b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        {PLAUSIBLE_DOMAIN ? (
          <script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
        ) : null}
        {ADS_ENABLED && ADSENSE_CLIENT ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {process.env.NODE_ENV === "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `addEventListener("load",()=>{"serviceWorker"in navigator&&navigator.serviceWorker.register("${bp}/sw.js")})`,
            }}
          />
        ) : null}
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${bp}/favicon.svg`} alt="" className="h-6 w-6 rounded-md" />
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
            <p>
              <Link href="/privacy/" className="hover:text-zinc-300">
                Privacy
              </Link>
              {" · "}
              <Link href="/terms/" className="hover:text-zinc-300">
                Terms
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
