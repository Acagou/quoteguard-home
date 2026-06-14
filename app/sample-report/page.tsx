import { ReportView } from "@/components/ReportView";
import { createSampleReport, sampleQuote } from "@/lib/report";

export default function SampleReportPage() {
  const report = createSampleReport();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-normal text-sage">Sample report</p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Drywall Repair Quote Review</h1>
      <div className="mt-5 rounded-lg border border-oat bg-paper p-5">
        <p className="text-sm font-semibold text-sage">Sample quote</p>
        <p className="mt-2 text-base leading-7 text-slateWarm">&quot;{sampleQuote}&quot;</p>
      </div>
      <div className="mt-6">
        <ReportView report={report} title="Scope Clarity Score" />
      </div>
    </main>
  );
}
