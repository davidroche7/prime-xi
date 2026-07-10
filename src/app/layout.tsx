import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import Link from "next/link";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/flags";
import { CREDITS, DISCLAIMER, PLAUSIBLE_DOMAIN, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const bp = process.env.BASE_PATH || "";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

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

export const viewport: Viewport = { themeColor: "#c8102e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoBlack.variable}`}>
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
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b-[3px] border-ink-950 bg-paper-100">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-base uppercase tracking-tight">
              The Perfect <span className="text-blood-600">XI</span>
            </Link>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wide">
              <Link href="/" className="hover:text-blood-600">
                Build an XI
              </Link>
              <Link href="/daily/" className="hover:text-blood-600">
                Daily quiz
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t-[3px] border-ink-950 py-6">
          <div className="mx-auto max-w-5xl space-y-2 px-4 text-xs leading-relaxed text-dune-600">
            <p>{DISCLAIMER}</p>
            <p>{CREDITS}</p>
            <p className="font-bold uppercase tracking-wide">
              <Link href="/privacy/" className="hover:text-blood-600">
                Privacy
              </Link>
              {" · "}
              <Link href="/terms/" className="hover:text-blood-600">
                Terms
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
