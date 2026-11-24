"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminLodging } from "@/composables/use-admin";
import { LodgingForm } from "@/components/admin/lodging-form";
import { RoomsTable } from "@/components/admin/rooms-table";
import { Alert, Button, Card, Field, Input, Select, Skeleton, Textarea } from "@/components/ui";
import { peso } from "@/lib/format";
import type { RoomType } from "@/lib/types";

export default function AdminLodgingEdit({ params }: { params: Promise<{ id: string }> }) {
  const id = Number(use(params).id);
  const s = useAdminLodging(id);
  const router = useRouter();
  const [editingType, setEditingType] = useState<RoomType | "new" | null>(null);
  const [saved, setSaved] = useState(false);

  if (!s.lodging || s.lodging.id !== id) return s.error ? <Alert>{s.error}</Alert> : <Skeleton className="h-96" />;
  const l = s.lodging;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">{l.name}</h1>
        <div className="flex gap-2">
          <Link href={`/lodgings/${l.slug}`}><Button variant="outline">View page</Button></Link>
          <Button variant="danger" onClick={async () => { if (confirm(`Delete ${l.name}? This removes its rooms too.`) && await s.deleteLodging(l.id)) router.push("/admin/lodgings"); }}>Delete</Button>
        </div>
      </div>
      {s.error && <Alert>{s.error}</Alert>}

      <Card className="p-6">
        <h2 className="mb-4 text-xl">Details</h2>
        <LodgingForm key={l.id} initial={l} onSubmit={async (b) => { if (await s.saveLodging(l.id, b)) { setSaved(true); s.fetchLodging(l.id); } }} />
        {saved && <p className="mt-2 text-sm text-pine-700">Saved.</p>}
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="text-xl">Photos</h2>
        <div className="flex flex-wrap gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {s.images.map((img) => <img key={img.id} src={img.url} alt={img.alt} className={`h-24 w-36 rounded-lg object-cover ${img.isCover ? "ring-2 ring-clay-500" : ""}`} />)}
        </div>
        <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const file = f.get("file");
          if (file instanceof File && file.size) { await s.uploadImage(l.id, file, f.get("cover") === "on"); e.currentTarget?.reset(); }
        }}>
          <Field label="Upload a photo" hint="JPEG, PNG or WebP up to 5 MB. Stored in Neon object storage."><Input name="file" type="file" accept="image/jpeg,image/png,image/webp" /></Field>
          <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" name="cover" />Make cover</label>
          <Button disabled={s.busy}>Upload</Button>
        </form>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between"><h2 className="text-xl">Room types</h2><Button variant="outline" onClick={() => setEditingType("new")}>Add room type</Button></div>
        {editingType && (
          <form className="grid gap-4 rounded-xl bg-sand-50 p-4 sm:grid-cols-3" onSubmit={async (e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget));
            await s.saveRoomType(editingType === "new" ? null : editingType.id, { ...f, lodgingId: l.id } as unknown as Partial<RoomType>);
            setEditingType(null);
          }}>
            {(() => { const t = editingType === "new" ? undefined : editingType; return (<>
              <Field label="Name"><Input name="name" required defaultValue={t?.name} /></Field>
              <Field label="Bed"><Input name="bed" required defaultValue={t?.bed} placeholder="1 queen bed" /></Field>
              <Field label="Price per night (₱)"><Input name="pricePerNight" type="number" min={1} step="0.01" required defaultValue={t?.pricePerNight} /></Field>
              <Field label="Max guests"><Input name="maxPersons" type="number" min={1} max={12} required defaultValue={t?.maxPersons ?? 2} /></Field>
              <Field label="Size (m²)"><Input name="sizeSqm" type="number" min={1} required defaultValue={t?.sizeSqm ?? 20} /></Field>
              <div className="sm:col-span-3"><Field label="Description"><Textarea name="description" required defaultValue={t?.description} /></Field></div>
              <div className="flex gap-2 sm:col-span-3"><Button>Save room type</Button><Button type="button" variant="ghost" onClick={() => setEditingType(null)}>Cancel</Button></div>
            </>); })()}
          </form>
        )}
        <div className="divide-y divide-sand-200">
          {s.roomTypes.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div><p className="font-medium">{t.name}</p><p className="text-xs text-muted">{t.bed} · up to {t.maxPersons} · {t.roomCount} rooms</p></div>
              <div className="flex items-center gap-3"><span>{peso(t.pricePerNight)}</span>
                <Button variant="ghost" onClick={() => setEditingType(t)}>Edit</Button>
                <Button variant="ghost" onClick={() => confirm(`Delete ${t.name} and its rooms?`) && s.deleteRoomType(t.id)}>Delete</Button></div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="text-xl">Rooms</h2>
        <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          await s.addRoom({ roomTypeId: Number(f.get("roomTypeId")), number: String(f.get("number")), floor: Number(f.get("floor")) });
        }}>
          <Field label="Room type"><Select name="roomTypeId" required>{s.roomTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></Field>
          <Field label="Number"><Input name="number" required className="w-28" /></Field>
          <Field label="Floor"><Input name="floor" type="number" min={0} required defaultValue={1} className="w-24" /></Field>
          <Button disabled={!s.roomTypes.length}>Add room</Button>
        </form>
        <RoomsTable rooms={s.rooms} roomTypes={s.roomTypes} onDelete={(r) => confirm(`Delete room ${r.number}?`) && s.deleteRoom(r.id)} />
      </Card>
    </div>
  );
}
