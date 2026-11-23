"use client";
import { BedDouble, Maximize2, Users } from "lucide-react";
import type { RoomType } from "@/lib/types";
import { peso } from "@/lib/format";
import { Button, Card } from "./ui";

export function RoomTypeCard({ room, onBook }: { room: RoomType; onBook: () => void }) {
  return (
    <Card className="flex flex-col overflow-hidden sm:flex-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={room.imageUrl} alt={room.name} className="h-48 w-full object-cover sm:h-auto sm:w-56" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl">{room.name}</h3>
          <p className="shrink-0 text-right"><span className="text-lg font-semibold">{peso(room.pricePerNight)}</span><span className="block text-xs text-muted">per night</span></p>
        </div>
        <p className="text-sm text-muted">{room.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1"><BedDouble size={14} />{room.bed}</span>
          <span className="flex items-center gap-1"><Users size={14} />Up to {room.maxPersons}</span>
          <span className="flex items-center gap-1"><Maximize2 size={14} />{room.sizeSqm} m²</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted">{room.roomCount} room{room.roomCount === 1 ? "" : "s"} of this type</span>
          <Button onClick={onBook} disabled={!room.roomCount}>Check dates</Button>
        </div>
      </div>
    </Card>
  );
}
