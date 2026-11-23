import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { quoteBookingUseCase } from "@/usecases/booking.usecase";

export const GET = handle(async (req: NextRequest) => quoteBookingUseCase(Object.fromEntries(req.nextUrl.searchParams)));
