import Link from "next/link";
import { ArrowRight, BadgeCheck, FileSearch, LockKeyhole, MessageCircleQuestion, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      <section className="dark-grid text-paper">
        <div className="mx-auto grid min-h-[calc(100svh-73px)] max-w-6xl gap-8 px-4 py-8 md:grid-cols-[0.94fr_1.06fr] md:items-center md:py-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-mint backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Quote clarity before approval
            </div>
            <h1 className="mt-5 text-5xl font-bold leading-[0.98] tracking-normal text-paper md:text-7xl">
              Got a home repair quote? Check it before you say yes.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-oat">
              Upload or paste your quote and get a plain-English review of what is clear, what is missing, what may cost extra, and what to ask before approving the work.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/check" className="inline-flex items-center justify-center gap-2 rounded-md bg-clay px-5 py-4 font-bold text-white shadow-lift transition hover:-translate-y-0.5">
                Check My Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/sample-report" className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 px-5 py-4 font-bold text-paper backdrop-blur transition hover:bg-white/15">
                See Sample Report
              </Link>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-oat">
              QuoteGuard does not find contractors or sell your project to multiple companies. It helps you understand the quote before you hire.
            </p>
          </div>

          <QuoteScanner />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature icon={<FileSearch />} title="Plain-English review" text="No legal wording, no contractor shaming, and no repair diagnosis." />
          <Feature icon={<MessageCircleQuestion />} title="Better questions" text="Ask about scope, materials, timeline, cleanup, warranty, and extra charges." />
          <Feature icon={<ShieldCheck />} title="Safety-aware" text="Water, electrical, gas, roof, mold, and structural work trigger safer guidance." />
        </div>
        <div className="mt-8 grid gap-4 rounded-lg border border-oat bg-paper p-4 shadow-soft md:grid-cols-[1fr_1.2fr] md:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-moss">Built for homeowners</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-ink">A calm second look before the job starts.</h2>
          </div>
          <div className="flex items-start gap-3 rounded-md bg-linen p-4">
            <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-clay" />
            <p className="text-sm leading-6 text-slateWarm">
              QuoteGuard does not diagnose repairs, does not replace a licensed professional, and does not call contractors bad. It reviews quote clarity and helps you ask practical questions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuoteScanner() {
  return (
    <div className="scan-sheen rounded-lg border border-white/10 bg-paper p-3 text-ink shadow-lift md:p-4">
      <div className="rounded-md border border-oat bg-linen p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-moss">Live sample</p>
            <h2 className="mt-1 text-xl font-bold">Drywall quote scan</h2>
          </div>
          <div className="rounded-md bg-night px-3 py-2 text-right text-paper">
            <p className="text-xs text-mint">Scope score</p>
            <p className="text-2xl font-bold">52</p>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-paper p-4 text-sm leading-6 text-slateWarm">
          Repair drywall damage in hallway. Patch damaged area as needed. Sand and prep. Materials included. Labor included. Total: $425. Additional work extra if needed.
        </div>

        <div className="mt-4 grid gap-3">
          <Insight tone="amber" label="Needs detail" text="Repair area, finish level, and cleanup are not clearly defined." />
          <Insight tone="clay" label="Could cost extra" text="Additional work is mentioned without a written approval process." />
          <Insight tone="moss" label="Ask before approving" text="Confirm what is included and what counts as complete." />
        </div>
      </div>
    </div>
  );
}

function Insight({ tone, label, text }: { tone: "amber" | "clay" | "moss"; label: string; text: string }) {
  const color = tone === "amber" ? "bg-amber" : tone === "clay" ? "bg-clay" : "bg-moss";
  return (
    <div className="flex gap-3 rounded-md bg-paper p-3">
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${color}`} />
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slateWarm">{text}</p>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <section className="rounded-lg border border-oat bg-paper p-5 shadow-soft">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-night text-mint [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slateWarm">{text}</p>
    </section>
  );
}
