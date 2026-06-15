"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Trash2 } from "lucide-react";

export type AiProvider = "fallback" | "openai" | "claude";

export function getStoredAiSettings() {
  if (typeof window === "undefined") {
    return { aiProvider: "fallback" as AiProvider, apiKey: "", model: "" };
  }

  return {
    aiProvider: (localStorage.getItem("quoteguard.aiProvider") as AiProvider | null) ?? "fallback",
    apiKey: localStorage.getItem("quoteguard.apiKey") ?? "",
    model: localStorage.getItem("quoteguard.model") ?? ""
  };
}

export function AiSettingsForm() {
  const [aiProvider, setAiProvider] = useState<AiProvider>("fallback");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredAiSettings();
    setAiProvider(stored.aiProvider);
    setApiKey(stored.apiKey);
    setModel(stored.model);
  }, []);

  function saveAiSettings() {
    localStorage.setItem("quoteguard.aiProvider", aiProvider);
    localStorage.setItem("quoteguard.apiKey", apiKey);
    localStorage.setItem("quoteguard.model", model);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function clearAiSettings() {
    localStorage.removeItem("quoteguard.aiProvider");
    localStorage.removeItem("quoteguard.apiKey");
    localStorage.removeItem("quoteguard.model");
    setAiProvider("fallback");
    setApiKey("");
    setModel("");
    setSaved(false);
  }

  return (
    <section className="rounded-lg border border-oat bg-paper p-4 shadow-soft md:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-night text-mint">
          <KeyRound className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-moss">AI settings</p>
          <h2 className="text-2xl font-bold text-ink">Choose your report engine</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slateWarm">
        Your API key is stored only on this device in this browser. It is sent to QuoteGuard only when you generate a report.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ["fallback", "Local"],
          ["openai", "OpenAI"],
          ["claude", "Claude"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setAiProvider(value as AiProvider)}
            className={`rounded-md border px-3 py-3 text-sm font-bold ${
              aiProvider === value ? "border-clay bg-clay text-white" : "border-oat bg-white text-ink hover:border-moss"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {aiProvider !== "fallback" && (
        <div className="mt-4 grid gap-3">
          <Field label={aiProvider === "openai" ? "OpenAI API key" : "Claude API key"}>
            <input
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              type="password"
              className="w-full rounded-md border border-oat bg-white p-4 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10"
              placeholder={aiProvider === "openai" ? "sk-..." : "sk-ant-..."}
            />
          </Field>
          <Field label="Model">
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="w-full rounded-md border border-oat bg-white p-4 text-ink outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/10"
              placeholder={aiProvider === "openai" ? "gpt-4.1-mini" : "claude-sonnet-4-5"}
            />
          </Field>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={saveAiSettings} className="rounded-md bg-night px-4 py-3 text-sm font-bold text-white">
          Save settings
        </button>
        <button type="button" onClick={clearAiSettings} className="inline-flex items-center gap-2 rounded-md border border-oat px-4 py-3 text-sm font-bold text-ink">
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {saved && (
        <p className="mt-4 flex items-center gap-2 rounded-md bg-mint/35 p-3 text-sm font-bold text-moss">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved on this device.
        </p>
      )}
    </section>
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
