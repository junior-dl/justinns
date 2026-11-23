import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getSession, requireAdmin } from "@/lib/session";
import { createLodgingUseCase, listLodgingsUseCase } from "@/usecases/lodging.usecase";

export const GET = handle(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const s = await getSession();
  return listLodgingsUseCase({ type: sp.get("type"), q: sp.get("q"), includeUnpublished: s?.user.role === "admin" && sp.get("all") === "1" });
});

export const POST = handle(async (req: NextRequest) => {
  await requireAdmin();
  return createLodgingUseCase(await req.json());
});
