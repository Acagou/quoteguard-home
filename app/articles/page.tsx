import Link from "next/link";
import { articles } from "@/lib/articles";

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-normal text-sage">Home repair quote guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Plain-English quote checklists</h1>
      <div className="mt-6 grid gap-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-lg border border-oat bg-paper p-5">
            <h2 className="text-xl font-bold text-ink">{article.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slateWarm">{article.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
