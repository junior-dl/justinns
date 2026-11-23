import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { getBookingByReferenceUseCase, setBookingStatusUseCase } from "@/usecases/booking.usecase";

type Ctx = { params: Promise<{ reference: string }> };

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => {
  const u = await requireUser();
  return getBookingByReferenceUseCase((await ctx.params).reference, u);
});

export const PATCH = handle(async (req: NextRequest, ctx: Ctx) => {
  const u = await requireUser();
  const body = (await req.json()) as { status?: unknown };
  return setBookingStatusUseCase((await ctx.params).reference, body.status, u);
});
