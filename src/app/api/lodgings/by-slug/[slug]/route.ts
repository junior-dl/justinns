import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getLodgingBySlugUseCase } from "@/usecases/lodging.usecase";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => getLodgingBySlugUseCase((await ctx.params).slug));
