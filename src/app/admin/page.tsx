"use client";
import { useAdminStats } from "@/composables/use-admin";
import { Alert, Card, PageHeader, Skeleton } from "@/components/ui";
import { peso } from "@/lib/format";

export default function AdminHome() {
  const { stats, error } = useAdminStats();
  if (error) return <Alert>{error}</Alert>;
  const items = stats ? [
    ["Lodgings", stats.lodgings], ["Rooms", stats.rooms], ["Upcoming bookings", stats.activeBookings],
    ["Guests", stats.guests], ["Booked revenue (demo)", peso(stats.revenue)],
  ] : [];
  return (
    <>
      <PageHeader eyebrow="Admin" title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats ? items.map(([k, v]) => (
          <Card key={k as string} className="p-5"><p className="text-xs text-muted">{k}</p><p className="mt-1 font-display text-3xl">{v}</p></Card>
        )) : Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    </>
  );
}
