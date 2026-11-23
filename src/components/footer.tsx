import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-sand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl">Just<span className="text-clay-500">Inns</span></p>
          <p className="mt-2 max-w-sm text-muted">
            A portfolio demo of a lodging booking site. Every hotel, inn and pension here is made up, and no payment is ever charged.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-medium">Stay</p>
          <Link href="/lodgings?type=hotel" className="block text-muted hover:text-ink">Hotels</Link>
          <Link href="/lodgings?type=inn" className="block text-muted hover:text-ink">Inns</Link>
          <Link href="/lodgings?type=pension" className="block text-muted hover:text-ink">Pension houses</Link>
        </div>
        <div className="space-y-2">
          <p className="font-medium">JustInns</p>
          <Link href="/about" className="block text-muted hover:text-ink">About</Link>
          <Link href="/discounts" className="block text-muted hover:text-ink">Deals</Link>
        </div>
      </div>
    </footer>
  );
}
