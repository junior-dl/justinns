"use client";
import Link from "next/link";
import { useLodgings } from "@/composables/use-lodgings";
import { useFavorites } from "@/composables/use-favorites";
import { RequireAuth } from "@/components/require-auth";
import { LodgingCard } from "@/components/lodging-card";
import { Alert, PageHeader } from "@/components/ui";

function Saved() {
  const { lodgings } = useLodgings();
  const { ids } = useFavorites();
  const saved = lodgings.filter((l) => ids.includes(l.id));
  if (!saved.length) return <Alert tone="info">Tap the heart on any place to save it here. <Link href="/lodgings" className="underline">Browse lodgings</Link></Alert>;
  return <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{saved.map((l) => <LodgingCard key={l.id} lodging={l} />)}</div>;
}

export default function FavoritesPage() {
  return <><PageHeader eyebrow="Account" title="Saved places" /><RequireAuth><Saved /></RequireAuth></>;
}
