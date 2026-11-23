"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useLodgings } from "@/composables/use-lodgings";
import { LodgingCard } from "@/components/lodging-card";
import { Skeleton } from "@/components/ui";

const categories = [
  { type: "hotel", title: "Hotels", body: "Full service, pools and city views." },
  { type: "inn", title: "Inns", body: "Small, friendly and close to the sights." },
  { type: "pension", title: "Pension houses", body: "Simple rooms at easy prices." },
] as const;

export default function HomePage() {
  const { lodgings, loading } = useLodgings();
  const [q, setQ] = useState("");
  const router = useRouter();
  const featured = [...lodgings].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6);

  return (
    <div className="space-y-20">
      <section className="relative -mt-10 overflow-hidden rounded-b-[2.5rem] bg-pine-700 px-6 py-20 text-sand-50 md:px-14 md:py-28">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_80%_at_85%_20%,#c4643f_0%,transparent_60%)]" />
        <div className="relative max-w-2xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200">Hotels · Inns · Pension houses</p>
          <h1 className="text-4xl leading-[1.05] md:text-6xl">Find a room that feels like it was kept for you.</h1>
          <p className="max-w-lg text-sand-200">Browse places to stay across the islands, check which rooms are free, and book in a few steps.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); router.push(`/lodgings?q=${encodeURIComponent(q)}`); }}
            className="flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-ink shadow-lg"
          >
            <Search size={18} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city or a place's name" aria-label="Search" className="flex-1 bg-transparent py-2 text-sm outline-none" />
            <button className="rounded-full bg-clay-500 px-5 py-2.5 text-sm font-medium text-white hover:brightness-95">Search</button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.type} href={`/lodgings?type=${c.type}`} className="group rounded-2xl border border-sand-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-pine-600">
            <h2 className="text-2xl">{c.title}</h2>
            <p className="mt-1 text-sm text-muted">{c.body}</p>
            <p className="mt-6 text-sm font-medium text-pine-600 group-hover:underline">
              {lodgings.filter((l) => l.type === c.type).length || ""} places →
            </p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl">Guest favorites</h2>
          <Link href="/lodgings" className="text-sm font-medium text-pine-600 hover:underline">See all</Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !lodgings.length
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : featured.map((l) => <LodgingCard key={l.id} lodging={l} />)}
        </div>
      </section>
    </div>
  );
}
