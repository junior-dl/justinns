import type { NextRequest } from "next/server";
import { handle, HttpError } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { createBookingUseCase, listAllBookingsUseCase, listBookingsByUserUseCase } from "@/usecases/booking.usecase";

export const GET = handle(async (req: NextRequest) => {
  const u = await requireUser();
  if (req.nextUrl.searchParams.get("all") === "1") {
    if (u.role !== "admin") throw new HttpError(403, "Admins only.");
    return listAllBookingsUseCase();
  }
  return listBookingsByUserUseCase(u.id);
});

export const POST = handle(async (req: NextRequest) => {
  const u = await requireUser();
  return createBookingUseCase(u.id, await req.json());
});
