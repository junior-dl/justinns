"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useLodgings } from "@/composables/use-lodgings";
import { LodgingCard } from "@/components/lodging-card";
import { Alert, Input, PageHeader, Skeleton } from "@/components/ui";
import type { LodgingType } from "@/lib/types";

const tabs: { value: LodgingType | null; label: string }[] = [
  { value: null, label: "All" }, { value: "hotel", label: "Hotels" }, { value: "inn", label: "Inns" }, { value: "pension", label: "Pensions" },
];

function LodgingsList() {
  const sp = useSearchParams();
  const router = useRouter();
  const type = (sp.get("type") as LodgingType | null) ?? null;
  const q = sp.get("q");
  const { lodgings, loading, error } = useLodgings({ type, q });

  const go = (next: { type?: LodgingType | null; q?: string | null }) => {
    const p = new URLSearchParams();
    const t = next.type !== undefined ? next.type : type;
    const s = next.q !== undefined ? next.q : q;
    if (t) p.set("type", t);
    if (s) p.set("q", s);
    router.push(`/lodgings?${p}`);
  };

  return (
    <>
      <PageHeader eyebrow="Places to stay" title={type ? tabs.find((t) => t.value === type)!.label : "All lodgings"}>
        {q ? <>Results for “{q}”</> : "Every place is fictional — but the booking works."}
      </PageHeader>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t.label} onClick={() => go({ type: t.value })}
              className={clsx("rounded-full px-4 py-2 text-sm", t.value === type ? "bg-ink text-white" : "border border-sand-200 bg-white hover:border-ink")}>
              {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); go({ q: new FormData(e.currentTarget).get("q") as string }); }} className="md:w-72">
          <Input name="q" defaultValue={q ?? ""} placeholder="Search by name or city" aria-label="Search lodgings" />
        </form>
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-[4/3]" />) : lodgings.map((l) => <LodgingCard key={l.id} lodging={l} />)}
      </div>
      {!loading && !error && !lodgings.length && <Alert tone="info">Nothing matches that search. Try another city or clear the filter.</Alert>}
    </>
  );
}

export default function LodgingsPage() {
  return <Suspense><LodgingsList /></Suspense>;
}
