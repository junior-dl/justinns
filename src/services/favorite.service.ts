import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorite } from "@/db/schema";

export async function listFavoriteLodgingIds(userId: string) {
  const rows = await db.select({ lodgingId: favorite.lodgingId }).from(favorite)
    .where(eq(favorite.userId, userId)).orderBy(desc(favorite.createdAt));
  return rows.map((r) => r.lodgingId);
}

export async function addFavorite(userId: string, lodgingId: number) {
  await db.insert(favorite).values({ userId, lodgingId }).onConflictDoNothing();
}

export async function removeFavorite(userId: string, lodgingId: number) {
  await db.delete(favorite).where(and(eq(favorite.userId, userId), eq(favorite.lodgingId, lodgingId)));
}
