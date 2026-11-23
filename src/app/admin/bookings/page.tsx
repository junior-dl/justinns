"use client";
import Link from "next/link";
import { useAdminBookings } from "@/composables/use-admin";
import { StatusBadge } from "@/components/status-badge";
import { Alert, PageHeader, Select } from "@/components/ui";
import { fmtDate, peso } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function AdminBookings() {
  const { bookings, setStatus, error } = useAdminBookings();
  return (
    <>
      <PageHeader eyebrow="Admin" title="Bookings" />
      {error && <Alert>{error}</Alert>}
      <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs text-muted"><tr>
            {["Reference", "Guest", "Lodging", "Dates", "Total", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.reference} className="border-t border-sand-200">
                <td className="px-4 py-3"><Link href={`/bookings/${b.reference}`} className="font-mono text-xs underline">{b.reference}</Link></td>
                <td className="px-4 py-3">{b.guestName}<span className="block text-xs text-muted">{b.guestEmail}</span></td>
                <td className="px-4 py-3">{b.lodgingName}<span className="block text-xs text-muted">{b.roomTypeName} · {b.roomNumber}</span></td>
                <td className="whitespace-nowrap px-4 py-3">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</td>
                <td className="px-4 py-3">{peso(b.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <Select aria-label="Change status" value={b.status} onChange={(e) => setStatus(b.reference, e.target.value as Booking["status"])} className="py-1.5 text-xs">
                    <option value="active">Upcoming</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!bookings.length && <p className="p-6 text-sm text-muted">No bookings yet.</p>}
      </div>
    </>
  );
}
