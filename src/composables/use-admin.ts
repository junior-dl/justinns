"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/admin.store";

export function useAdminStats() {
  const s = useAdminStore();
  const { fetchStats } = s;
  useEffect(() => { fetchStats(); }, [fetchStats]);
  return { stats: s.stats, error: s.error };
}

export function useAdminBookings() {
  const s = useAdminStore();
  const { fetchBookings } = s;
  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  return { bookings: s.bookings, setStatus: s.setBookingStatus, error: s.error, busy: s.busy };
}

export function useAdminLodging(id: number | null) {
  const s = useAdminStore();
  const { fetchLodging } = s;
  useEffect(() => { if (id) fetchLodging(id); }, [fetchLodging, id]);
  return s;
}
