import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { createRoomUseCase } from "@/usecases/room.usecase";

export const POST = handle(async (req: NextRequest) => {
  await requireAdmin();
  return createRoomUseCase(await req.json());
});
