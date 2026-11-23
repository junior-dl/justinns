import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { removeFavoriteUseCase } from "@/usecases/favorite.usecase";

type Ctx = { params: Promise<{ lodgingId: string }> };

export const DELETE = handle(async (_req: NextRequest, ctx: Ctx) => {
  const u = await requireUser();
  return removeFavoriteUseCase(u.id, (await ctx.params).lodgingId);
});
