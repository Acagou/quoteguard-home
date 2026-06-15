import Link from "next/link";
import { Settings, ShieldCheck } from "lucide-react";
import { InstallPwaButton } from "@/components/InstallPwaButton";

export function Header() {
  return (
    <header className="dark-nav sticky top-0 z-30 border-b border-white/10 text-paper backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-paper">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-mint text-night">
            <ShieldCheck className="h-5 w-5" />
          </span>
          QuoteGuard Home
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold text-linen">
          <Link href="/sample-report" className="hidden sm:inline">
            Sample
          </Link>
          <Link href="/settings" className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-paper">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <InstallPwaButton />
          <Link href="/check" className="rounded-md bg-clay px-3 py-2 text-white shadow-soft">
            Check
          </Link>
        </nav>
      </div>
    </header>
  );
}
