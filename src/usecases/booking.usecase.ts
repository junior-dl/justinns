import { z } from "zod";
import * as bookingService from "@/services/booking.service";
import * as roomService from "@/services/room.service";
import * as roomTypeService from "@/services/room-type.service";
import * as discountService from "@/services/discount.service";
import { stayQuerySchema } from "./room.usecase";
import { HttpError } from "@/lib/http";
import { nightsBetween } from "@/lib/format";

const today = () => new Date().toISOString().slice(0, 10);

const quoteSchema = z.object({
  roomTypeId: z.coerce.number().int().positive(),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  discountCode: z.string().trim().max(40).optional().nullable(),
});

export const createBookingSchema = z.object({
  roomId: z.coerce.number().int().positive(),
  checkIn: z.iso.date("Pick a check-in date."),
  checkOut: z.iso.date("Pick a check-out date."),
  adults: z.coerce.number().int().min(1, "At least one adult is required."),
  children: z.coerce.number().int().min(0).default(0),
  guestName: z.string().trim().min(2, "Enter the guest's name.").max(200),
  contactNumber: z.string().trim().regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid contact number."),
  discountCode: z.string().trim().max(40).optional().nullable(),
  paymentMethod: z.enum(["card", "e-wallet", "bank-transfer"]),
});

async function priceFor(roomTypeId: number, checkIn: string, checkOut: string, code?: string | null) {
  if (checkOut <= checkIn) throw new HttpError(400, "Check-out must be after check-in.");
  if (checkIn < today()) throw new HttpError(400, "Check-in can't be in the past.");
  const nights = nightsBetween(checkIn, checkOut);
  if (nights > 30) throw new HttpError(400, "Stays are limited to 30 nights.");
  const type = await roomTypeService.getRoomType(roomTypeId);
  if (!type) throw new HttpError(404, "Room type not found.");
  let percentOff = 0;
  let appliedCode: string | null = null;
  if (code) {
    const d = await discountService.findActiveDiscount(code);
    if (!d) throw new HttpError(400, "That discount code isn't valid.");
    percentOff = d.percentOff;
    appliedCode = d.code;
  }
  return { type, appliedCode, percentOff, ...bookingService.quoteBooking(Number(type.pricePerNight), nights, percentOff) };
}

export async function quoteBookingUseCase(query: unknown) {
  const q = quoteSchema.parse(query);
  const p = await priceFor(q.roomTypeId, q.checkIn, q.checkOut, q.discountCode);
  return {
    roomTypeName: p.type.name, pricePerNight: Number(p.type.pricePerNight), nights: p.nights,
    subtotal: p.subtotal, discountAmount: p.discountAmount, total: p.total,
    discountCode: p.appliedCode, percentOff: p.percentOff,
  };
}

/** Books a room and records a demo payment. No real money moves. */
export async function createBookingUseCase(userId: string, body: unknown) {
  const input = createBookingSchema.parse(body);
  const rm = await roomService.getRoom(input.roomId);
  if (!rm) throw new HttpError(404, "Room not found.");
  const p = await priceFor(rm.roomTypeId, input.checkIn, input.checkOut, input.discountCode);
  if (input.adults + input.children > p.type.maxPersons) {
    throw new HttpError(400, `This room fits up to ${p.type.maxPersons} guests.`);
  }

  const created = await bookingService.createBooking({
    reference: bookingService.makeReference(),
    userId, roomId: rm.id, checkIn: input.checkIn, checkOut: input.checkOut,
    adults: input.adults, children: input.children, guestName: input.guestName, contactNumber: input.contactNumber,
    discountCode: p.appliedCode, subtotal: p.subtotal.toFixed(2), discountAmount: p.discountAmount.toFixed(2), total: p.total.toFixed(2),
  });
  if (!created) throw new HttpError(409, "Sorry, that room was just booked for those dates. Pick another room.");

  await bookingService.createPayment({
    bookingId: created.id, amount: p.total.toFixed(2), method: input.paymentMethod,
    mockReference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  });
  return { reference: created.reference };
}

const toNum = <T extends { subtotal: string; discountAmount: string; total: string }>(b: T) =>
  ({ ...b, subtotal: Number(b.subtotal), discountAmount: Number(b.discountAmount), total: Number(b.total) });

export async function listBookingsByUserUseCase(userId: string) {
  return (await bookingService.listBookingsByUser(userId)).map(toNum);
}

export async function listAllBookingsUseCase() {
  return (await bookingService.listAllBookings()).map(toNum);
}

export async function getBookingByReferenceUseCase(reference: string, viewer: { id: string; role?: string | null }) {
  const b = await bookingService.getBookingByReference(reference);
  if (!b || (b.userId !== viewer.id && viewer.role !== "admin")) throw new HttpError(404, "Booking not found.");
  const pay = await bookingService.getPaymentByBooking(b.id);
  return { ...toNum(b), payment: pay ? { method: pay.method, mockReference: pay.mockReference, amount: Number(pay.amount) } : null };
}

export async function getPaymentByBookingUseCase(bookingId: number) {
  return bookingService.getPaymentByBooking(bookingId);
}

export async function setBookingStatusUseCase(reference: string, status: unknown, viewer: { id: string; role?: string | null }) {
  const next = z.enum(["active", "cancelled", "completed"]).parse(status);
  const b = await bookingService.getBookingByReference(reference);
  const isAdmin = viewer.role === "admin";
  if (!b || (b.userId !== viewer.id && !isAdmin)) throw new HttpError(404, "Booking not found.");
  if (!isAdmin) {
    if (next !== "cancelled") throw new HttpError(403, "You can only cancel your own bookings.");
    if (b.status !== "active") throw new HttpError(400, "Only active bookings can be cancelled.");
    if (b.checkIn <= today()) throw new HttpError(400, "Bookings can't be cancelled on or after the check-in date.");
  }
  const row = await bookingService.setBookingStatus(b.id, next);
  return { reference: row!.reference, status: row!.status };
}

export { stayQuerySchema };
