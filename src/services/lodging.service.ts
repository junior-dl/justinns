import { and, asc, avg, count, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { lodging, lodgingImage, review } from "@/db/schema";

export type LodgingType = "hotel" | "inn" | "pension";
export type LodgingInput = typeof lodging.$inferInsert;

export async function listLodgings(filter: { type?: LodgingType; q?: string; includeUnpublished?: boolean } = {}) {
  const where: SQL[] = [];
  if (!filter.includeUnpublished) where.push(eq(lodging.isPublished, true));
  if (filter.type) where.push(eq(lodging.type, filter.type));
  if (filter.q) where.push(or(ilike(lodging.name, `%${filter.q}%`), ilike(lodging.city, `%${filter.q}%`))!);

  return db
    .select({
      id: lodging.id, slug: lodging.slug, name: lodging.name, type: lodging.type, city: lodging.city,
      tagline: lodging.tagline, isPublished: lodging.isPublished,
      // Correlated subqueries are written as plain SQL so every column is table-qualified.
      coverKey: sql<string | null>`(select li.storage_key from lodging_image li where li.lodging_id = "lodging"."id" order by li.is_cover desc, li.sort_order limit 1)`,
      fromPrice: sql<string | null>`(select min(rt.price_per_night) from room_type rt where rt.lodging_id = "lodging"."id")`,
      rating: sql<string | null>`(select round(avg(rv.rating), 1) from review rv where rv.lodging_id = "lodging"."id")`,
      reviewCount: sql<number>`(select count(*)::int from review rv where rv.lodging_id = "lodging"."id")`,
    })
    .from(lodging)
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(lodging.name));
}

export async function getLodgingBySlug(slug: string) {
  const [row] = await db.select().from(lodging).where(eq(lodging.slug, slug)).limit(1);
  return row ?? null;
}

export async function getLodgingById(id: number) {
  const [row] = await db.select().from(lodging).where(eq(lodging.id, id)).limit(1);
  return row ?? null;
}

export async function getLodgingRating(lodgingId: number) {
  const [row] = await db
    .select({ rating: avg(review.rating), reviewCount: count(review.id) })
    .from(review)
    .where(eq(review.lodgingId, lodgingId));
  return row;
}

export async function listLodgingImages(lodgingId: number) {
  return db.select().from(lodgingImage).where(eq(lodgingImage.lodgingId, lodgingId))
    .orderBy(sql`${lodgingImage.isCover} desc`, asc(lodgingImage.sortOrder));
}

export async function createLodging(input: LodgingInput) {
  const [row] = await db.insert(lodging).values(input).returning();
  return row;
}

export async function updateLodging(id: number, input: Partial<LodgingInput>) {
  const [row] = await db.update(lodging).set(input).where(eq(lodging.id, id)).returning();
  return row ?? null;
}

export async function deleteLodging(id: number) {
  const rows = await db.delete(lodging).where(eq(lodging.id, id)).returning({ id: lodging.id });
  return rows.length > 0;
}

export async function addLodgingImage(input: typeof lodgingImage.$inferInsert) {
  if (input.isCover) {
    await db.update(lodgingImage).set({ isCover: false }).where(eq(lodgingImage.lodgingId, input.lodgingId));
  }
  const [row] = await db.insert(lodgingImage).values(input).returning();
  return row;
}

export async function slugExists(slug: string) {
  const [row] = await db.select({ id: lodging.id }).from(lodging).where(eq(lodging.slug, slug)).limit(1);
  return !!row;
}
