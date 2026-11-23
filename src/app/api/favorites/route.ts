import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { addFavoriteUseCase, listFavoriteLodgingIdsUseCase } from "@/usecases/favorite.usecase";

export const GET = handle(async () => listFavoriteLodgingIdsUseCase((await requireUser()).id));

export const POST = handle(async (req: NextRequest) => {
  const u = await requireUser();
  const body = (await req.json()) as { lodgingId?: unknown };
  return addFavoriteUseCase(u.id, body.lodgingId);
});
