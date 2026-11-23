import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getLodgingRatingUseCase } from "@/usecases/lodging.usecase";

type Ctx = { params: Promise<{ id: string }> };

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => getLodgingRatingUseCase(Number((await ctx.params).id)));
