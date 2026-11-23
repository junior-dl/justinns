"use client";
import { useEffect } from "react";
import { useBookingStore } from "@/stores/booking.store";

export function useBookingFlow() {
  return useBookingStore();
}

export function useMyBookings() {
  const s = useBookingStore();
  const { fetchMine } = s;
  useEffect(() => { fetchMine(); }, [fetchMine]);
  return { bookings: s.myBookings, loading: s.loading, error: s.error, cancel: s.cancel };
}

export function useBooking(reference: string) {
  const s = useBookingStore();
  const { fetchOne } = s;
  useEffect(() => { fetchOne(reference); }, [fetchOne, reference]);
  return { booking: s.current, loading: s.loading, error: s.error, cancel: s.cancel };
}

/** ISO date (yyyy-mm-dd) `offset` days from today, in local time. */
export function isoDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
