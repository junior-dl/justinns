import * as dashboardService from "@/services/dashboard.service";

export async function getAdminStatsUseCase() {
  const s = await dashboardService.getAdminStats();
  return { ...s, revenue: Number(s.revenue) };
}
