"use client";
import type { Lodging } from "@/lib/types";
import { Button, Field, Input, Select, Textarea } from "../ui";

export function LodgingForm({ initial, onSubmit, onCancel }: { initial?: Lodging; onSubmit: (b: Partial<Lodging>) => void; onCancel?: () => void }) {
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      onSubmit({
        name: String(f.get("name")), type: f.get("type") as Lodging["type"], city: String(f.get("city")), address: String(f.get("address")),
        tagline: String(f.get("tagline")) || null, description: String(f.get("description")),
        amenities: String(f.get("amenities")).split(",").map((s) => s.trim()).filter(Boolean),
        checkInTime: String(f.get("checkInTime")), checkOutTime: String(f.get("checkOutTime")), isPublished: f.get("isPublished") === "on",
      });
    }}>
      <Field label="Name"><Input name="name" required defaultValue={initial?.name} /></Field>
      <Field label="Type"><Select name="type" defaultValue={initial?.type ?? "hotel"}><option value="hotel">Hotel</option><option value="inn">Inn</option><option value="pension">Pension house</option></Select></Field>
      <Field label="City"><Input name="city" required defaultValue={initial?.city} /></Field>
      <Field label="Address"><Input name="address" required defaultValue={initial?.address} /></Field>
      <div className="sm:col-span-2"><Field label="Tagline"><Input name="tagline" defaultValue={initial?.tagline ?? ""} /></Field></div>
      <div className="sm:col-span-2"><Field label="Description"><Textarea name="description" required minLength={10} defaultValue={initial?.description} /></Field></div>
      <div className="sm:col-span-2"><Field label="Amenities" hint="Separate with commas."><Input name="amenities" defaultValue={initial?.amenities.join(", ")} /></Field></div>
      <Field label="Check-in time"><Input name="checkInTime" type="time" defaultValue={initial?.checkInTime ?? "14:00"} /></Field>
      <Field label="Check-out time"><Input name="checkOutTime" type="time" defaultValue={initial?.checkOutTime ?? "12:00"} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? true} />Visible to guests</label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button>Save lodging</Button>
      </div>
    </form>
  );
}
