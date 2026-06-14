import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="dark-grid min-h-[calc(100svh-73px)] px-4 py-10 text-paper">
      <section className="mx-auto max-w-xl rounded-lg border border-white/10 bg-white/10 p-6 shadow-lift backdrop-blur">
        <span className="grid h-12 w-12 place-items-center rounded-md bg-mint text-night">
          <WifiOff className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight">You are offline.</h1>
        <p className="mt-3 text-base leading-7 text-oat">
          QuoteGuard can reopen cached pages while offline. New quote checks need a connection because report generation may call the server.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-clay px-4 py-3 font-bold text-white">
          Return Home
        </Link>
      </section>
    </main>
  );
}
