"use client";
import { use } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useBooking } from "@/composables/use-booking";
import { RequireAuth } from "@/components/require-auth";
import { StatusBadge } from "@/components/status-badge";
import { Alert, Button, Card, Skeleton } from "@/components/ui";
import { fmtDate, nightsBetween, peso } from "@/lib/format";

function Confirmation({ reference }: { reference: string }) {
  const { booking: b, loading, error, cancel } = useBooking(reference);
  const isNew = useSearchParams().get("new") === "1";
  if (loading || (!b && !error)) return <Skeleton className="h-96" />;
  if (!b) return <Alert>{error}</Alert>;
  const nights = nightsBetween(b.checkIn, b.checkOut);
  const canCancel = b.status === "active" && b.checkIn > new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {isNew && b.status === "active" && (
        <div className="flex items-center gap-3 rounded-2xl bg-pine-50 p-5 text-pine-700">
          <CheckCircle2 /><div><p className="font-medium">You&apos;re booked!</p><p className="text-sm">Your reference is {b.reference}. (Demo — no confirmation email is sent.)</p></div>
        </div>
      )}
      <Card className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Booking {b.reference}</p>
            <Link href={`/lodgings/${b.lodgingSlug}`} className="font-display text-3xl hover:underline">{b.lodgingName}</Link>
            <p className="text-sm text-muted">{b.city}</p>
          </div>
          <StatusBadge status={b.status} />
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Check-in</dt><dd className="font-medium">{fmtDate(b.checkIn)}</dd></div>
          <div><dt className="text-muted">Check-out</dt><dd className="font-medium">{fmtDate(b.checkOut)} · {nights} night{nights > 1 ? "s" : ""}</dd></div>
          <div><dt className="text-muted">Room</dt><dd className="font-medium">{b.roomTypeName}, room {b.roomNumber}</dd></div>
          <div><dt className="text-muted">Guests</dt><dd className="font-medium">{b.guestName} · {b.adults} adult{b.adults > 1 ? "s" : ""}{b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}</dd></div>
        </dl>
        <dl className="space-y-1.5 border-t border-sand-200 pt-4 text-sm">
          <div className="flex justify-between"><dt>Room charges</dt><dd>{peso(b.subtotal)}</dd></div>
          {b.discountAmount > 0 && <div className="flex justify-between text-pine-700"><dt>Discount {b.discountCode}</dt><dd>−{peso(b.discountAmount)}</dd></div>}
          <div className="flex justify-between text-base font-semibold"><dt>Total paid</dt><dd>{peso(b.total)}</dd></div>
          {b.payment && <p className="pt-1 text-xs text-muted">Simulated {b.payment.method} payment · ref {b.payment.mockReference}</p>}
        </dl>
        {error && <Alert>{error}</Alert>}
        <div className="flex gap-3">
          <Link href="/bookings"><Button variant="outline">All my trips</Button></Link>
          {canCancel && <Button variant="danger" onClick={() => confirm("Cancel this booking?") && cancel(b.reference)}>Cancel booking</Button>}
        </div>
      </Card>
    </div>
  );
}

export default function BookingPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = use(params);
  return <RequireAuth><Confirmation reference={reference} /></RequireAuth>;
}
