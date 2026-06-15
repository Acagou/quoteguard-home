import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AiSettingsForm } from "@/components/AiSettingsForm";

export default function SettingsPage() {
  return (
    <main className="bg-linen">
      <section className="dark-grid text-paper">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-sm font-bold uppercase tracking-normal text-mint">Settings</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-normal md:text-5xl">Add your OpenAI or Claude API key.</h1>
          <p className="mt-3 text-base leading-7 text-oat">
            Choose the AI provider QuoteGuard should use when generating quote reports on this device.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-5">
        <AiSettingsForm />
        <Link href="/check" className="mt-5 inline-flex items-center gap-2 rounded-md bg-clay px-4 py-3 font-bold text-white">
          Check a quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
