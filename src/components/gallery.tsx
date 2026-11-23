"use client";
import { useState } from "react";
import clsx from "clsx";
import type { LodgingImage } from "@/lib/types";

export function Gallery({ images, name }: { images: LodgingImage[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-[16/7] rounded-3xl bg-sand-200" />;
  const main = images[active] ?? images[0];
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={main.url} alt={main.alt || name} className="aspect-[16/10] w-full rounded-3xl object-cover md:aspect-[16/9]" />
      <div className="flex gap-3 overflow-x-auto md:flex-col">
        {images.slice(0, 5).map((img, i) => (
          <button key={img.id} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}
            className={clsx("shrink-0 overflow-hidden rounded-xl ring-2 transition", i === active ? "ring-pine-600" : "ring-transparent opacity-80 hover:opacity-100")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-20 w-32 object-cover md:h-[88px] md:w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
