"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLodgings } from "@/composables/use-lodgings";
import { useAdminStore } from "@/stores/admin.store";
import { LodgingForm } from "@/components/admin/lodging-form";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { peso } from "@/lib/format";

export default function AdminLodgings() {
  const { lodgings } = useLodgings({ all: true });
  const [creating, setCreating] = useState(false);
  const save = useAdminStore((s) => s.saveLodging);
  const router = useRouter();
  return (
    <>
      <div className="flex items-start justify-between">
        <PageHeader eyebrow="Admin" title="Lodgings" />
        {!creating && <Button onClick={() => setCreating(true)}>Add lodging</Button>}
      </div>
      {creating && (
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl">New lodging</h2>
          <LodgingForm onCancel={() => setCreating(false)} onSubmit={async (body) => { const l = await save(null, body); if (l) router.push(`/admin/lodgings/${l.id}`); }} />
        </Card>
      )}
      <div className="grid gap-3">
        {lodgings.map((l) => (
          <Link key={l.id} href={`/admin/lodgings/${l.id}`}>
            <Card className="flex items-center gap-4 p-3 transition hover:border-pine-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.coverUrl} alt="" className="h-16 w-24 rounded-lg object-cover" />
              <div className="flex-1"><p className="font-medium">{l.name}</p><p className="text-xs text-muted">{l.city}{l.fromPrice ? ` · from ${peso(l.fromPrice)}` : ""}</p></div>
              <Badge>{l.type}</Badge>{!l.isPublished && <Badge tone="clay">hidden</Badge>}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
