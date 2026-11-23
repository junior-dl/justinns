import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { roomType } from "@/db/schema";

export type RoomTypeInput = typeof roomType.$inferInsert;

export async function listRoomTypesByLodging(lodgingId: number) {
  return db
    .select({
      id: roomType.id, lodgingId: roomType.lodgingId, name: roomType.name, description: roomType.description,
      bed: roomType.bed, sizeSqm: roomType.sizeSqm, maxPersons: roomType.maxPersons,
      pricePerNight: roomType.pricePerNight, imageKey: roomType.imageKey,
      roomCount: sql<number>`(select count(*)::int from room r where r.room_type_id = "room_type"."id")`,
    })
    .from(roomType)
    .where(eq(roomType.lodgingId, lodgingId))
    .orderBy(asc(roomType.pricePerNight));
}

export async function getRoomType(id: number) {
  const [row] = await db.select().from(roomType).where(eq(roomType.id, id)).limit(1);
  return row ?? null;
}

export async function createRoomType(input: RoomTypeInput) {
  const [row] = await db.insert(roomType).values(input).returning();
  return row;
}

export async function updateRoomType(id: number, input: Partial<RoomTypeInput>) {
  const [row] = await db.update(roomType).set(input).where(eq(roomType.id, id)).returning();
  return row ?? null;
}

export async function deleteRoomType(id: number) {
  const rows = await db.delete(roomType).where(eq(roomType.id, id)).returning({ id: roomType.id });
  return rows.length > 0;
}
