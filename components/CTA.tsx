import Link from "next/link";

export function CTA() {
  return (
    <div className="dark-grid rounded-lg p-5 text-paper shadow-lift">
      <h2 className="text-2xl font-bold">Know what you&apos;re agreeing to before you hire.</h2>
      <p className="mt-2 text-sm leading-6 text-oat">Paste your quote and get a plain-English review you can use before approving the work.</p>
      <Link href="/check" className="mt-4 inline-flex rounded-md bg-clay px-4 py-3 font-semibold text-white">
        Check My Quote
      </Link>
    </div>
  );
}
