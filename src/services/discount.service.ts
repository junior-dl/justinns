import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { discount } from "@/db/schema";

export async function findActiveDiscount(code: string) {
  const [row] = await db.select().from(discount)
    .where(and(sql`upper(${discount.code}) = upper(${code})`, eq(discount.isActive, true))).limit(1);
  return row ?? null;
}

export async function listActiveDiscounts() {
  return db.select().from(discount).where(eq(discount.isActive, true)).orderBy(asc(discount.percentOff));
}
