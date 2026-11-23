import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { createReviewUseCase, listReviewsByUserUseCase } from "@/usecases/review.usecase";

export const GET = handle(async () => listReviewsByUserUseCase((await requireUser()).id));

export const POST = handle(async (req: NextRequest) => {
  const u = await requireUser();
  return createReviewUseCase(u.id, await req.json());
});
