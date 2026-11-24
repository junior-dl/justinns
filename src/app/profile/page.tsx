"use client";
import Link from "next/link";
import { CalendarDays, Heart, Luggage, MessageSquareText } from "lucide-react";
import { useProfile } from "@/composables/use-profile";
import { useMyBookings } from "@/composables/use-booking";
import { useFavorites } from "@/composables/use-favorites";
import { RequireAuth } from "@/components/require-auth";
import { StatusBadge } from "@/components/status-badge";
import { Stars } from "@/components/stars";
import { Alert, Badge, Button, Card, Field, Input, PageHeader, Skeleton } from "@/components/ui";
import { fmtDate, nightsBetween, peso } from "@/lib/format";

function Stat({ icon: Icon, label, value, href }: { icon: typeof Luggage; label: string; value: number; href?: string }) {
  const body = (
    <Card className="flex items-center gap-3 p-4 transition hover:border-ink">
      <span className="grid size-10 place-items-center rounded-full bg-peach"><Icon size={18} /></span>
      <span><span className="block text-2xl font-semibold leading-none">{value}</span><span className="text-xs text-muted">{label}</span></span>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

function Account() {
  const { profile, reviews, save, saving, message } = useProfile();
  const { bookings } = useMyBookings();
  const { ids: saved } = useFavorites();
  if (!profile) return <Skeleton className="h-96" />;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.status === "active" && b.checkOut >= today).sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const next = upcoming[0];
  const initials = profile.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <Card className="flex flex-col items-center p-6 text-center">
          <span className="grid size-24 place-items-center rounded-full bg-peach text-3xl font-semibold">{initials}</span>
          <h2 className="mt-4 text-xl">{profile.name}</h2>
          <p className="text-sm text-muted">{profile.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge tone={profile.role === "admin" ? "clay" : "neutral"}>{profile.role}</Badge>
            <span className="text-xs text-muted">Member since {fmtDate(profile.createdAt)}</span>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Luggage} label="Trips" value={bookings.length} href="/bookings" />
          <Stat icon={CalendarDays} label="Upcoming" value={upcoming.length} href="/bookings" />
          <Stat icon={Heart} label="Saved" value={saved.length} href="/favorites" />
          <Stat icon={MessageSquareText} label="Reviews" value={reviews.length} />
        </div>
      </aside>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">Next trip</h2>
            <Link href="/bookings" className="text-sm font-medium hover:underline">All trips</Link>
          </div>
          {next ? (
            <Link href={`/bookings/${next.reference}`} className="flex flex-col gap-3 rounded-xl border border-sand-200 p-4 transition hover:border-ink sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{next.lodgingName}</p>
                <p className="text-sm text-muted">{next.roomTypeName} · {fmtDate(next.checkIn)} → {fmtDate(next.checkOut)} · {nightsBetween(next.checkIn, next.checkOut)} nights</p>
              </div>
              <div className="flex items-center gap-3"><span className="text-sm font-medium">{peso(next.total)}</span><StatusBadge status={next.status} /></div>
            </Link>
          ) : (
            <p className="text-sm text-muted">No upcoming trips. <Link href="/lodgings" className="font-medium text-ink underline">Find a place to stay</Link></p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg">Personal details</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            save({ name: String(f.get("name")), phone: String(f.get("phone")) || null, address: String(f.get("address")) || null });
          }}>
            <Field label="Full name"><Input name="name" defaultValue={profile.name} required /></Field>
            <Field label="Phone"><Input name="phone" inputMode="tel" defaultValue={profile.phone ?? ""} placeholder="0917 000 0000" /></Field>
            <div className="sm:col-span-2"><Field label="Address"><Input name="address" defaultValue={profile.address ?? ""} placeholder="Street, city" /></Field></div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Button disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
              {message && (message === "Saved." ? <span className="text-sm text-muted">Saved.</span> : <Alert>{message}</Alert>)}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg">Your reviews</h2>
          {reviews.length ? (
            <ul className="divide-y divide-sand-200">
              {reviews.slice(0, 4).map((r) => (
                <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/lodgings/${r.lodgingSlug}`} className="font-medium hover:underline">{r.lodgingName}</Link>
                    <Stars value={r.rating} size={8} />
                  </div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="line-clamp-2 text-sm text-muted">{r.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">You haven&apos;t reviewed anywhere yet. After a stay starts, you can review it from the lodging&apos;s page.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <><PageHeader eyebrow="Account" title="Your profile" /><RequireAuth><Account /></RequireAuth></>;
}
