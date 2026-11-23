import { handle } from "@/lib/http";
import { requireAdmin } from "@/lib/session";
import { getAdminStatsUseCase } from "@/usecases/dashboard.usecase";

export const GET = handle(async () => {
  await requireAdmin();
  return getAdminStatsUseCase();
});
