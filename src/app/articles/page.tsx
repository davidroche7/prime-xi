import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { PROD_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liverpool FC history articles",
  description:
    "Long reads on Liverpool FC history: the 1892 split from Everton, Shankly, Paisley, Fagan, Dalglish, Houllier, Istanbul and Klopp.",
  alternates: { canonical: `${PROD_URL}/articles/` },
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">Liverpool FC history</h1>
      <ul className="space-y-5">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={`/articles/${a.slug}/`} className="font-display text-lg text-ink-950 hover:text-blood-600">
              {a.title}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-dune-600">{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
