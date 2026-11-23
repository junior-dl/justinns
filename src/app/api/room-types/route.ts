import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { createRoomTypeUseCase } from "@/usecases/room-type.usecase";

export const POST = handle(async (req: NextRequest) => {
  await requireAdmin();
  return createRoomTypeUseCase(await req.json());
});
