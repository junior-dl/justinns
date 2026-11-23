"use client";
import Link from "next/link";
import { useMyBookings } from "@/composables/use-booking";
import { RequireAuth } from "@/components/require-auth";
import { StatusBadge } from "@/components/status-badge";
import { Alert, Card, PageHeader, Skeleton } from "@/components/ui";
import { fmtDate, peso } from "@/lib/format";

function Trips() {
  const { bookings, loading, error } = useMyBookings();
  if (loading && !bookings.length) return <Skeleton className="h-64" />;
  if (error) return <Alert>{error}</Alert>;
  if (!bookings.length) return <Alert tone="info">No trips yet. <Link href="/lodgings" className="underline">Find a place to stay</Link></Alert>;
  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <Link key={b.reference} href={`/bookings/${b.reference}`}>
          <Card className="flex flex-col gap-2 p-5 transition hover:border-pine-600 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl">{b.lodgingName}</p>
              <p className="text-sm text-muted">{b.roomTypeName} · {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</p>
            </div>
            <div className="flex items-center gap-4"><span className="text-sm font-medium">{peso(b.total)}</span><StatusBadge status={b.status} /></div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function BookingsPage() {
  return <><PageHeader eyebrow="Account" title="My trips" /><RequireAuth><Trips /></RequireAuth></>;
}
