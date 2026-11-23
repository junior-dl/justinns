import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { booking, lodging, payment, room, roomType, user } from "@/db/schema";

export type NewBooking = typeof booking.$inferInsert;

/**
 * Inserts a booking. The database has an exclusion constraint that rejects
 * overlapping active bookings for the same room, so two people racing for the
 * same room can never both succeed. Returns null when the room was taken.
 */
export async function createBooking(input: NewBooking) {
  try {
    const [row] = await db.insert(booking).values(input).returning();
    return row;
  } catch (err) {
    const code = (err as { code?: string; cause?: { code?: string } }).code ?? (err as { cause?: { code?: string } }).cause?.code;
    if (code === "23P01") return null; // exclusion_violation
    throw err;
  }
}

export async function createPayment(input: typeof payment.$inferInsert) {
  const [row] = await db.insert(payment).values(input).returning();
  return row;
}

const bookingColumns = {
  id: booking.id, reference: booking.reference, checkIn: booking.checkIn, checkOut: booking.checkOut,
  adults: booking.adults, children: booking.children, guestName: booking.guestName, contactNumber: booking.contactNumber,
  subtotal: booking.subtotal, discountAmount: booking.discountAmount, discountCode: booking.discountCode,
  total: booking.total, status: booking.status, createdAt: booking.createdAt, userId: booking.userId,
  roomNumber: room.number, roomTypeName: roomType.name,
  lodgingId: lodging.id, lodgingName: lodging.name, lodgingSlug: lodging.slug, lodgingType: lodging.type, city: lodging.city,
};

function bookingQuery() {
  return db.select({ ...bookingColumns, guestEmail: user.email })
    .from(booking)
    .innerJoin(room, eq(booking.roomId, room.id))
    .innerJoin(roomType, eq(room.roomTypeId, roomType.id))
    .innerJoin(lodging, eq(room.lodgingId, lodging.id))
    .innerJoin(user, eq(booking.userId, user.id));
}

export async function listBookingsByUser(userId: string) {
  return bookingQuery().where(eq(booking.userId, userId)).orderBy(desc(booking.checkIn));
}

export async function listAllBookings() {
  return bookingQuery().orderBy(desc(booking.createdAt)).limit(200);
}

export async function getBookingByReference(reference: string) {
  const [row] = await bookingQuery().where(eq(booking.reference, reference)).limit(1);
  return row ?? null;
}

export async function getPaymentByBooking(bookingId: number) {
  const [row] = await db.select().from(payment).where(eq(payment.bookingId, bookingId)).limit(1);
  return row ?? null;
}

export async function setBookingStatus(id: number, status: "active" | "cancelled" | "completed") {
  const [row] = await db.update(booking).set({ status }).where(eq(booking.id, id)).returning();
  return row ?? null;
}

/** Business rule: price = nightly rate × nights, minus percent discount (rounded to centavos). */
export function quoteBooking(pricePerNight: number, nights: number, percentOff = 0) {
  const subtotal = Math.round(pricePerNight * nights * 100) / 100;
  const discountAmount = Math.round(subtotal * (percentOff / 100) * 100) / 100;
  return { nights, subtotal, discountAmount, total: Math.round((subtotal - discountAmount) * 100) / 100 };
}

export function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "JI-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
