import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ARTICLES } from "@/lib/articles";
import { PROD_URL, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${PROD_URL}/articles/${slug}/` },
    openGraph: { title: article.title, url: `${SITE_URL}/articles/${slug}/`, images: ["/og.png"] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950 sm:text-3xl">{article.title}</h1>
      {article.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-display text-lg uppercase text-ink-950">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <AdSlot slot="article-below-prose" />
      <p>
        Think you know this history? <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">Build your Perfect XI</Link>,
        or read <Link href="/articles/" className="font-semibold text-blood-600 hover:text-red-300">more articles</Link>.
      </p>
    </article>
  );
}
