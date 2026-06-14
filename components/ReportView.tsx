import { AlertTriangle, BadgeCheck, ClipboardList, Copy, HelpCircle, MessageSquare, ShieldAlert } from "lucide-react";
import { QuoteReport, scoreExplanation } from "@/lib/report";

type ReportViewProps = {
  report: QuoteReport;
  title?: string;
};

export function ReportView({ report, title = "QuoteGuard Report" }: ReportViewProps) {
  const scoreOffset = 283 - (report.score / 100) * 283;

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-oat bg-night text-paper shadow-lift">
        <div className="dark-grid grid gap-5 p-5 md:grid-cols-[17rem_1fr] md:p-6">
          <div className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold text-mint">{title}</p>
            <div className="relative mx-auto mt-4 h-44 w-44">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#BFE7D2"
                  strokeLinecap="round"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={scoreOffset}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-5xl font-bold tracking-normal">{report.score}</p>
                  <p className="text-sm font-bold text-oat">/100</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-lg font-bold text-mint">{report.scoreLabel}</p>
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-oat">Scope clarity</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">Know what is clear before you approve the work.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-oat">{scoreExplanation}</p>
            </div>
            {report.safetyBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.safetyBadges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-2 rounded-md bg-clay px-3 py-2 text-sm font-bold text-white">
                    <ShieldAlert className="h-4 w-4" />
                    Safety-sensitive: {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Section icon={<BadgeCheck />} title="Plain-English Summary">
        <p>{report.summary}</p>
      </Section>

      <Section icon={<AlertTriangle />} title="Red Flags & Missing Details">
        <List items={report.redFlags} />
      </Section>

      <Section icon={<HelpCircle />} title="Questions to Ask Before You Approve">
        <List items={report.questions} />
      </Section>

      <Section icon={<MessageSquare />} title="Message to Send Contractor" actionIcon={<Copy />}>
        <pre className="whitespace-pre-wrap rounded-md border border-oat bg-linen p-4 font-sans text-sm leading-6 text-ink shadow-inner">{report.message}</pre>
      </Section>

      <Section icon={<ClipboardList />} title="Important Note">
        <p>{report.note}</p>
      </Section>
    </section>
  );
}

function Section({ icon, title, children, actionIcon }: { icon: React.ReactNode; title: string; children: React.ReactNode; actionIcon?: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-oat bg-paper p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-night text-mint [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
        </div>
        {actionIcon && <span className="hidden text-slateWarm sm:block [&_svg]:h-5 [&_svg]:w-5">{actionIcon}</span>}
      </div>
      <div className="mt-4 text-base leading-7 text-slateWarm">{children}</div>
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
