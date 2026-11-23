import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { addLodgingImageUseCase, listLodgingImagesUseCase } from "@/usecases/lodging.usecase";

type Ctx = { params: Promise<{ id: string }> };
const idOf = async (ctx: Ctx) => Number((await ctx.params).id);

export const GET = handle(async (_req: NextRequest, ctx: Ctx) => listLodgingImagesUseCase(await idOf(ctx)));

export const POST = handle(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const form = await req.formData();
  const file = form.get("file");
  return addLodgingImageUseCase(await idOf(ctx), file instanceof File ? file : null, form.get("isCover") === "true");
});
