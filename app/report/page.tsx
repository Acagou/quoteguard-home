"use client";

import Link from "next/link";
import { ReportView } from "@/components/ReportView";
import { createReport, QuoteContext, sampleQuote } from "@/lib/report";

const defaultContext: QuoteContext = {
  repairType: "Home repair",
  location: "Not provided",
  urgency: "Not provided",
  sensitiveItems: []
};

export default function ReportPage() {
  const report = createReport(sampleQuote, defaultContext);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-normal text-sage">QuoteGuard report</p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Review your quote before approving it.</h1>
      <p className="mt-3 text-base leading-7 text-slateWarm">
        This page is ready for generated reports. Use the quote check flow to create a report from pasted quote text.
      </p>
      <div className="mt-5">
        <Link href="/check" className="inline-flex rounded-md bg-ink px-4 py-3 font-semibold text-white">
          Check My Quote
        </Link>
      </div>
      <div className="mt-6">
        <ReportView report={report} />
      </div>
    </main>
  );
}
