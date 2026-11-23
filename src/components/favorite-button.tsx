"use client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useFavorites } from "@/composables/use-favorites";

export function FavoriteButton({ lodgingId, className }: { lodgingId: number; className?: string }) {
  const { isFavorite, toggle, signedIn } = useFavorites();
  const router = useRouter();
  const on = isFavorite(lodgingId);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => {
        e.preventDefault();
        if (!signedIn) return router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
        toggle(lodgingId);
      }}
      className={clsx("grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105", className)}
    >
      <Heart size={17} className={on ? "fill-clay-500 text-clay-500" : "text-ink"} />
    </button>
  );
}
