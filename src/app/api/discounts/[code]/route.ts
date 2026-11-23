import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { findActiveDiscountUseCase } from "@/usecases/discount.usecase";

type Ctx = { params: Promise<{ code: string }> };

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => findActiveDiscountUseCase((await ctx.params).code));
