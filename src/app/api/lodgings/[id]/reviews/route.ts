import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { listReviewsByLodgingUseCase } from "@/usecases/review.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => listReviewsByLodgingUseCase(await idOf(ctx)));
