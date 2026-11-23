import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { deleteRoomTypeUseCase, getRoomTypeUseCase, updateRoomTypeUseCase } from "@/usecases/room-type.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => getRoomTypeUseCase(await idOf(ctx)));

export const PATCH = handle(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  return updateRoomTypeUseCase(await idOf(ctx), await req.json());
});

export const DELETE = handle(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  return deleteRoomTypeUseCase(await idOf(ctx));
});
