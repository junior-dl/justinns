import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { listRoomTypesByLodgingUseCase } from "@/usecases/room-type.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => listRoomTypesByLodgingUseCase(await idOf(ctx)));
