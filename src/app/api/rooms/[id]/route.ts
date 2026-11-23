import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { deleteRoomUseCase } from "@/usecases/room.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const DELETE = handle(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  return deleteRoomUseCase(await idOf(ctx));
});
