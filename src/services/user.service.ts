import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

export async function getProfile(userId: string) {
  const [row] = await db.select({ id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role, createdAt: user.createdAt })
    .from(user).where(eq(user.id, userId)).limit(1);
  return row ?? null;
}

export async function updateProfile(userId: string, input: { name?: string; phone?: string | null; address?: string | null }) {
  const [row] = await db.update(user).set({ ...input, updatedAt: new Date() }).where(eq(user.id, userId))
    .returning({ id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address });
  return row ?? null;
}
