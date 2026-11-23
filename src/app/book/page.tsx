"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { useBookingFlow, isoDay } from "@/composables/use-booking";
import { useAuth } from "@/composables/use-auth";
import { RequireAuth } from "@/components/require-auth";
import { Alert, Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { fmtDate, peso } from "@/lib/format";

const methods = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "e-wallet", label: "E-wallet", icon: Wallet },
  { value: "bank-transfer", label: "Bank transfer", icon: Landmark },
] as const;

function BookFlow() {
  const s = useBookingFlow();
  const { user } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<string>("card");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;
  const d = s.draft;
  if (!d) return <Alert tone="info">Pick a room first. <Link href="/lodgings" className="underline">Browse lodgings</Link></Alert>;
  const guests = d.adults + d.children;
  const ready = !!s.quote && s.rooms.length > 0;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <h2 className="text-xl">1. Your stay</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Check-in"><Input type="date" min={isoDay(0)} value={d.checkIn} onChange={(e) => s.updateDraft({ checkIn: e.target.value })} /></Field>
            <Field label="Check-out"><Input type="date" min={d.checkIn} value={d.checkOut} onChange={(e) => s.updateDraft({ checkOut: e.target.value })} /></Field>
            <Field label="Adults"><Input type="number" min={1} max={d.maxPersons} value={d.adults} onChange={(e) => s.updateDraft({ adults: Number(e.target.value) })} /></Field>
            <Field label="Children"><Input type="number" min={0} max={d.maxPersons} value={d.children} onChange={(e) => s.updateDraft({ children: Number(e.target.value) })} /></Field>
            <Field label="Discount code" hint="Optional. See the Deals page for demo codes."><Input value={d.discountCode} onChange={(e) => s.updateDraft({ discountCode: e.target.value.toUpperCase() })} placeholder="e.g. WELCOME10" /></Field>
          </div>
          {guests > d.maxPersons && <Alert>This room fits up to {d.maxPersons} guests.</Alert>}
          <Button onClick={() => s.checkAvailability()} disabled={s.loading || guests > d.maxPersons || guests < 1}>
            {s.loading && !ready ? "Checking…" : "Check availability"}
          </Button>
        </Card>

        {ready && (
          <Card className="space-y-5 p-6">
            <h2 className="text-xl">2. Pick a room</h2>
            <div className="flex flex-wrap gap-2">
              {s.rooms.map((r) => (
                <button key={r.id} onClick={() => s.selectRoom(r.id)}
                  className={clsx("rounded-xl border px-4 py-2 text-sm", s.selectedRoomId === r.id ? "border-pine-600 bg-pine-50 text-pine-700" : "border-sand-200 bg-white hover:border-ink")}>
                  Room {r.number} <span className="text-muted">· floor {r.floor}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {ready && (
          <Card className="p-6">
            <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const ref = await s.submit({ guestName: String(f.get("guestName")), contactNumber: String(f.get("contactNumber")), paymentMethod: method });
              if (ref) router.push(`/bookings/${ref}?new=1`);
            }}>
              <h2 className="text-xl">3. Guest details & payment</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Guest name"><Input name="guestName" required defaultValue={user?.name ?? ""} /></Field>
                <Field label="Contact number"><Input name="contactNumber" required inputMode="tel" defaultValue={(user as { phone?: string } | null)?.phone ?? ""} placeholder="0917 000 0000" /></Field>
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Payment method</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {methods.map((m) => (
                    <label key={m.value} className={clsx("flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm", method === m.value ? "border-pine-600 bg-pine-50" : "border-sand-200 bg-white")}>
                      <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="sr-only" />
                      <m.icon size={16} />{m.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Alert tone="info">This is a demo checkout. No card or account details are asked for, and nothing is charged — the payment is only recorded.</Alert>
              {s.error && <Alert>{s.error}</Alert>}
              <Button disabled={s.loading || !s.selectedRoomId}>{s.loading ? "Booking…" : `Confirm & pay ${peso(s.quote!.total)}`}</Button>
            </form>
          </Card>
        )}
        {!ready && s.error && <Alert>{s.error}</Alert>}
      </div>

      <Card className="h-fit space-y-4 p-6 md:sticky md:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-500">Summary</p>
        <div>
          <Link href={`/lodgings/${d.lodgingSlug}`} className="font-display text-xl hover:underline">{d.lodgingName}</Link>
          <p className="text-sm text-muted">{d.roomTypeName}</p>
        </div>
        <p className="text-sm">{fmtDate(d.checkIn)} → {fmtDate(d.checkOut)}<br /><span className="text-muted">{d.adults} adult{d.adults > 1 ? "s" : ""}{d.children ? `, ${d.children} child${d.children > 1 ? "ren" : ""}` : ""}</span></p>
        {s.quote ? (
          <dl className="space-y-1.5 border-t border-sand-200 pt-4 text-sm">
            <div className="flex justify-between"><dt>{peso(s.quote.pricePerNight)} × {s.quote.nights} night{s.quote.nights > 1 ? "s" : ""}</dt><dd>{peso(s.quote.subtotal)}</dd></div>
            {s.quote.discountAmount > 0 && <div className="flex justify-between text-pine-700"><dt>{s.quote.discountCode} (−{s.quote.percentOff}%)</dt><dd>−{peso(s.quote.discountAmount)}</dd></div>}
            <div className="flex justify-between border-t border-sand-200 pt-2 text-base font-semibold"><dt>Total</dt><dd>{peso(s.quote.total)}</dd></div>
          </dl>
        ) : <p className="border-t border-sand-200 pt-4 text-sm text-muted">Check availability to see the price.</p>}
      </Card>
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      <PageHeader eyebrow="Booking" title="Reserve your room" />
      <RequireAuth><BookFlow /></RequireAuth>
    </>
  );
}
