import Link from "next/link";
import { MapPin } from "lucide-react";
import type { LodgingCard as L } from "@/lib/types";
import { peso } from "@/lib/format";
import { FavoriteButton } from "./favorite-button";
import { Badge } from "./ui";

export function LodgingCard({ lodging: l }: { lodging: L }) {
  return (
    <Link href={`/lodgings/${l.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.coverUrl} alt={l.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <FavoriteButton lodgingId={l.id} className="absolute right-3 top-3" />
        <span className="absolute left-3 top-3"><Badge>{l.type}</Badge></span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg leading-tight">{l.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted"><MapPin size={13} />{l.city}</p>
        </div>
        {l.rating !== null && <span className="shrink-0 text-sm font-medium">★ {l.rating.toFixed(1)} <span className="text-muted">({l.reviewCount})</span></span>}
      </div>
      {l.fromPrice !== null && <p className="mt-1 text-sm"><span className="font-semibold">{peso(l.fromPrice)}</span> <span className="text-muted">/ night</span></p>}
    </Link>
  );
}
