import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function getAdminStats() {
  const result = await db.execute(sql`
    select
      (select count(*)::int from lodging) as lodgings,
      (select count(*)::int from room) as rooms,
      (select count(*)::int from booking where status = 'active') as active_bookings,
      (select count(*)::int from "user" where role = 'guest') as guests,
      (select coalesce(sum(total), 0)::text from booking where status <> 'cancelled') as revenue
  `);
  const r = result.rows[0] as { lodgings: number; rooms: number; active_bookings: number; guests: number; revenue: string };
  return { lodgings: r.lodgings, rooms: r.rooms, activeBookings: r.active_bookings, guests: r.guests, revenue: r.revenue };
}
