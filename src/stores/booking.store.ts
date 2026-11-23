import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api-client";
import type { Booking, Quote, Room } from "@/lib/types";

export interface StayDraft {
  lodgingSlug: string; lodgingName: string; roomTypeId: number; roomTypeName: string; maxPersons: number;
  checkIn: string; checkOut: string; adults: number; children: number; discountCode: string;
}

interface BookingState {
  draft: StayDraft | null;
  quote: Quote | null;
  rooms: Room[];
  selectedRoomId: number | null;
  loading: boolean;
  error: string | null;
  myBookings: Booking[];
  current: Booking | null;
  startDraft: (d: StayDraft) => void;
  updateDraft: (patch: Partial<StayDraft>) => void;
  selectRoom: (id: number) => void;
  checkAvailability: () => Promise<boolean>;
  submit: (details: { guestName: string; contactNumber: string; paymentMethod: string }) => Promise<string | null>;
  fetchMine: () => Promise<void>;
  fetchOne: (reference: string) => Promise<void>;
  cancel: (reference: string) => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(persist((set, get) => ({
  draft: null, quote: null, rooms: [], selectedRoomId: null, loading: false, error: null, myBookings: [], current: null,

  startDraft: (draft) => set({ draft, quote: null, rooms: [], selectedRoomId: null, error: null }),
  updateDraft: (patch) => set((s) => ({ draft: s.draft ? { ...s.draft, ...patch } : null, quote: null, rooms: [], selectedRoomId: null })),
  selectRoom: (id) => set({ selectedRoomId: id }),

  async checkAvailability() {
    const d = get().draft;
    if (!d) return false;
    set({ loading: true, error: null });
    try {
      const base = { roomTypeId: String(d.roomTypeId), checkIn: d.checkIn, checkOut: d.checkOut };
      const [quote, rooms] = await Promise.all([
        api<Quote>(`/api/bookings/quote?${new URLSearchParams({ ...base, ...(d.discountCode ? { discountCode: d.discountCode } : {}) })}`),
        api<Room[]>(`/api/rooms/available?${new URLSearchParams(base)}`),
      ]);
      set({ quote, rooms, selectedRoomId: rooms[0]?.id ?? null, loading: false });
      if (!rooms.length) set({ error: "No rooms of this type are free for those dates. Try other dates." });
      return rooms.length > 0;
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      return false;
    }
  },

  async submit(details) {
    const { draft: d, selectedRoomId } = get();
    if (!d || !selectedRoomId) return null;
    set({ loading: true, error: null });
    try {
      const { reference } = await api<{ reference: string }>("/api/bookings", {
        method: "POST",
        json: { roomId: selectedRoomId, checkIn: d.checkIn, checkOut: d.checkOut, adults: d.adults, children: d.children, discountCode: d.discountCode || null, ...details },
      });
      set({ loading: false, draft: null, quote: null, rooms: [], selectedRoomId: null });
      return reference;
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      return null;
    }
  },

  async fetchMine() {
    set({ loading: true, error: null });
    try {
      set({ myBookings: await api<Booking[]>("/api/bookings"), loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  async fetchOne(reference) {
    set({ loading: true, error: null, current: null });
    try {
      set({ current: await api<Booking>(`/api/bookings/${reference}`), loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  async cancel(reference) {
    set({ error: null });
    try {
      await api(`/api/bookings/${reference}`, { method: "PATCH", json: { status: "cancelled" } });
      set((s) => ({
        myBookings: s.myBookings.map((b) => (b.reference === reference ? { ...b, status: "cancelled" } : b)),
        current: s.current?.reference === reference ? { ...s.current, status: "cancelled" } : s.current,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  reset: () => set({ draft: null, quote: null, rooms: [], selectedRoomId: null, error: null }),
}), { name: "justinns-booking", partialize: (s) => ({ draft: s.draft }) }));
