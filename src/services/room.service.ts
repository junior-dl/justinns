import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { booking, room, roomType } from "@/db/schema";

export async function listRoomsByLodging(lodgingId: number) {
  return db
    .select({ id: room.id, number: room.number, floor: room.floor, roomTypeId: room.roomTypeId, roomTypeName: roomType.name })
    .from(room)
    .innerJoin(roomType, eq(room.roomTypeId, roomType.id))
    .where(eq(room.lodgingId, lodgingId))
    .orderBy(asc(room.floor), asc(room.number));
}

export async function getRoom(id: number) {
  const [row] = await db.select().from(room).where(eq(room.id, id)).limit(1);
  return row ?? null;
}

export async function createRoom(input: typeof room.$inferInsert) {
  const [row] = await db.insert(room).values(input).returning();
  return row;
}

export async function deleteRoom(id: number) {
  const rows = await db.delete(room).where(eq(room.id, id)).returning({ id: room.id });
  return rows.length > 0;
}

/**
 * Rooms of a type with no active booking overlapping [checkIn, checkOut).
 * Two stays overlap when existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn.
 * (The PHP version also counted cancelled bookings and missed some overlaps.)
 */
export async function findAvailableRooms(roomTypeId: number, checkIn: string, checkOut: string) {
  return db
    .select({ id: room.id, number: room.number, floor: room.floor })
    .from(room)
    .where(and(
      eq(room.roomTypeId, roomTypeId),
      sql`not exists (
        select 1 from ${booking}
        where ${booking.roomId} = ${room.id}
          and ${booking.status} = 'active'
          and ${booking.checkIn} < ${checkOut}
          and ${booking.checkOut} > ${checkIn}
      )`,
    ))
    .orderBy(asc(room.floor), asc(room.number));
}
