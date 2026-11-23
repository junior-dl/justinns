import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { deleteLodgingUseCase, getLodgingByIdUseCase, updateLodgingUseCase } from "@/usecases/lodging.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => getLodgingByIdUseCase(await idOf(ctx)));

export const PATCH = handle(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  return updateLodgingUseCase(await idOf(ctx), await req.json());
});

export const DELETE = handle(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  return deleteLodgingUseCase(await idOf(ctx));
});
