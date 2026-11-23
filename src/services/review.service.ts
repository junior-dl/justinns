import { and, desc, eq, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import { booking, lodging, review, room, user } from "@/db/schema";

export async function listReviewsByLodging(lodgingId: number) {
  return db
    .select({ id: review.id, title: review.title, rating: review.rating, comment: review.comment, createdAt: review.createdAt, author: user.name })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .where(eq(review.lodgingId, lodgingId))
    .orderBy(desc(review.createdAt));
}

export async function createReview(input: typeof review.$inferInsert) {
  const [row] = await db.insert(review).values(input).onConflictDoNothing().returning();
  return row ?? null;
}

/** True when the user has a non-cancelled stay at the lodging that has already started. */
export async function hasStayedAt(userId: string, lodgingId: number, today: string) {
  const [row] = await db
    .select({ id: booking.id })
    .from(booking)
    .innerJoin(room, eq(booking.roomId, room.id))
    .where(and(
      eq(booking.userId, userId),
      eq(room.lodgingId, lodgingId),
      lte(booking.checkIn, today),
      inArray(booking.status, ["active", "completed"]),
    ))
    .limit(1);
  return !!row;
}

export async function listReviewsByUser(userId: string) {
  return db
    .select({ id: review.id, title: review.title, rating: review.rating, comment: review.comment, createdAt: review.createdAt, lodgingName: lodging.name, lodgingSlug: lodging.slug })
    .from(review)
    .innerJoin(lodging, eq(review.lodgingId, lodging.id))
    .where(eq(review.userId, userId))
    .orderBy(desc(review.createdAt));
}
