import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { articles, getArticle } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  return {
    title: article ? `${article.title} | QuoteGuard Home` : "QuoteGuard Home",
    description: article?.description
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <article className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-sage">QuoteGuard guide</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">{article.title}</h1>
          <p className="mt-3 text-base leading-7 text-slateWarm">{article.description}</p>
        </div>

        <Section title="Plain-English Explanation">
          <p>{article.explanation}</p>
        </Section>

        <Section title="Example Quote">
          <p>&quot;{article.exampleQuote}&quot;</p>
        </Section>

        <Section title="Red Flags">
          <List items={article.redFlags} />
        </Section>

        <Section title="Questions to Ask">
          <List items={article.questions} />
        </Section>

        <CTA />

        <Section title="Disclaimer">
          <p>
            QuoteGuard reviews quote clarity only. It does not diagnose repairs, replace a licensed professional, decide whether a quote is fair, or say whether a contractor is good or bad.
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-oat bg-paper p-5">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 text-base leading-7 text-slateWarm">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-clay" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
