import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { getProfileUseCase, updateProfileUseCase } from "@/usecases/user.usecase";

export const GET = handle(async () => getProfileUseCase((await requireUser()).id));

export const PATCH = handle(async (req: NextRequest) => {
  const u = await requireUser();
  return updateProfileUseCase(u.id, await req.json());
});
