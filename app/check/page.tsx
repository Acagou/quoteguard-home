"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { AlertTriangle, FileUp, Loader2, ScanLine, ShieldAlert } from "lucide-react";
import { ReportView } from "@/components/ReportView";
import { QuoteReport, SensitiveRepair } from "@/lib/report";

const sensitiveOptions: SensitiveRepair[] = ["water", "electrical", "gas", "roof", "mold", "structural"];

export default function QuoteCheckPage() {
  const [quoteText, setQuoteText] = useState("");
  const [fileName, setFileName] = useState("");
  const [repairType, setRepairType] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("Not urgent");
  const [sensitiveItems, setSensitiveItems] = useState<SensitiveRepair[]>([]);
  const [report, setReport] = useState<QuoteReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => quoteText.trim().length > 20 && repairType.trim().length > 1 && location.trim().length > 1, [quoteText, repairType, location]);
  const progress = [quoteText.trim().length > 20, repairType.trim().length > 1, location.trim().length > 1, true].filter(Boolean).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReport(null);

    if (!canSubmit) {
      setError("Paste the quote text, repair type, and city/state before generating a report.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteText,
          context: { repairType, location, urgency, sensitiveItems }
        })
      });

      if (!response.ok) {
        throw new Error("Report generation failed.");
      }

      const data = (await response.json()) as QuoteReport;
      setReport(data);
      setTimeout(() => document.getElementById("report-output")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch {
      setError("QuoteGuard could not generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? "");
  }

  function toggleSensitive(item: SensitiveRepair) {
    setSensitiveItems((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  }

  return (
    <main className="bg-linen">
      <section className="bg-night text-paper">
        <div className="mx-auto max-w-5xl px-4 py-7">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-normal text-mint">
            <ScanLine className="h-4 w-4" />
            Quote check
          </div>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">Drop in a quote. Get the questions that matter.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-oat">
            Paste your quote text, answer four context questions, and get a plain-English clarity report before you approve the work.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 lg:grid-cols-[1fr_22rem] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-lg border border-oat bg-paper p-4 shadow-soft md:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-moss">Step 1</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Paste or upload your quote</h2>
              </div>
              <span className="rounded-md bg-night px-3 py-2 text-sm font-bold text-mint">{quoteText.trim().length} chars</span>
            </div>
            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="quoteText">
              Quote text
            </label>
            <textarea
              id="quoteText"
              value={quoteText}
              onChange={(event) => setQuoteText(event.target.value)}
              rows={9}
              className="mt-2 w-full rounded-md border border-oat bg-white p-4 text-base leading-7 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10"
              placeholder="Paste the contractor quote here..."
            />
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-moss bg-linen px-4 py-4 text-sm font-bold text-ink transition hover:bg-mint/30">
              <FileUp className="h-5 w-5 text-clay" />
              Upload image or PDF
              <input className="sr-only" type="file" accept="image/*,.pdf" onChange={handleFile} />
            </label>
            {fileName && (
              <p className="mt-2 text-sm leading-6 text-slateWarm">
                Selected: {fileName}. For this MVP, paste the quote text above so the report can review it.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-oat bg-paper p-4 shadow-soft md:p-5">
            <p className="text-xs font-bold uppercase tracking-normal text-moss">Step 2</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">Four context questions</h2>
            <div className="mt-4 grid gap-4">
              <Field label="What type of repair is this?">
                <input
                  value={repairType}
                  onChange={(event) => setRepairType(event.target.value)}
                  className="w-full rounded-md border border-oat bg-white p-4 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10"
                  placeholder="Drywall, plumbing, roofing..."
                />
              </Field>
              <Field label="What city/state are you in?">
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-md border border-oat bg-white p-4 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10"
                  placeholder="Austin, TX"
                />
              </Field>
              <Field label="Is this urgent?">
                <select value={urgency} onChange={(event) => setUrgency(event.target.value)} className="w-full rounded-md border border-oat bg-white p-4 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10">
                  <option>Not urgent</option>
                  <option>Soon, but not emergency</option>
                  <option>Urgent</option>
                </select>
              </Field>
              <Field label="Does this involve water, electrical, gas, roof, mold, or structural damage?">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {sensitiveOptions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleSensitive(item)}
                      className={`rounded-md border px-3 py-3 text-left text-sm font-bold capitalize transition ${
                        sensitiveItems.includes(item) ? "border-clay bg-clay text-white shadow-soft" : "border-oat bg-white text-ink hover:border-moss"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {sensitiveItems.length > 0 && (
                  <p className="mt-3 flex gap-2 rounded-md bg-mint/35 p-3 text-sm leading-6 text-slateWarm">
                    <ShieldAlert className="mt-1 h-4 w-4 shrink-0 text-moss" />
                    This adds a safety-sensitive repair badge and recommendations to ask about licensed professionals, permits, inspections, or specialists.
                  </p>
                )}
              </Field>
            </div>
          </section>

          {error && (
            <p className="flex gap-2 rounded-md border border-clay bg-paper p-3 text-sm font-bold text-clay">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-night px-5 py-4 font-bold text-white shadow-lift transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slateWarm disabled:shadow-none disabled:hover:translate-y-0"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            Generate QuoteGuard Report
          </button>
        </form>

        <aside className="sticky top-24 rounded-lg border border-oat bg-paper p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-normal text-moss">Readiness</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold text-ink">{progress}</span>
            <span className="pb-2 text-lg font-bold text-slateWarm">/4</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-oat">
            <div className="h-2 rounded-full bg-clay transition-all" style={{ width: `${(progress / 4) * 100}%` }} />
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slateWarm">
            <CheckLine done={quoteText.trim().length > 20} text="Quote text added" />
            <CheckLine done={repairType.trim().length > 1} text="Repair type added" />
            <CheckLine done={location.trim().length > 1} text="City/state added" />
            <CheckLine done text="Safety context reviewed" />
          </div>
        </aside>
      </div>

      {report && (
        <section id="report-output" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-10">
          <ReportView report={report} />
        </section>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function CheckLine({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${done ? "bg-moss" : "bg-oat"}`} />
      <span>{text}</span>
    </div>
  );
}
