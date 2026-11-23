import { create } from "zustand";
import { api } from "@/lib/api-client";
import type { AdminStats, Booking, Lodging, LodgingImage, Room, RoomType } from "@/lib/types";

interface AdminState {
  stats: AdminStats | null;
  bookings: Booking[];
  lodging: Lodging | null;
  roomTypes: RoomType[];
  rooms: Room[];
  images: LodgingImage[];
  error: string | null;
  busy: boolean;
  fetchStats: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  setBookingStatus: (reference: string, status: Booking["status"]) => Promise<void>;
  fetchLodging: (id: number) => Promise<void>;
  saveLodging: (id: number | null, body: Partial<Lodging>) => Promise<Lodging | null>;
  deleteLodging: (id: number) => Promise<boolean>;
  uploadImage: (lodgingId: number, file: File, isCover: boolean) => Promise<void>;
  saveRoomType: (id: number | null, body: Partial<RoomType>) => Promise<void>;
  deleteRoomType: (id: number) => Promise<void>;
  addRoom: (body: { roomTypeId: number; number: string; floor: number }) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => {
  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    set({ busy: true, error: null });
    try {
      const r = await fn();
      set({ busy: false });
      return r;
    } catch (e) {
      set({ busy: false, error: (e as Error).message });
      return null;
    }
  };
  const reloadLodging = async () => { const l = get().lodging; if (l) await get().fetchLodging(l.id); };

  return {
    stats: null, bookings: [], lodging: null, roomTypes: [], rooms: [], images: [], error: null, busy: false,

    fetchStats: async () => { await run(async () => set({ stats: await api<AdminStats>("/api/admin/stats") })); },
    fetchBookings: async () => { await run(async () => set({ bookings: await api<Booking[]>("/api/bookings?all=1") })); },
    setBookingStatus: async (reference, status) => {
      await run(async () => {
        await api(`/api/bookings/${reference}`, { method: "PATCH", json: { status } });
        set({ bookings: get().bookings.map((b) => (b.reference === reference ? { ...b, status } : b)) });
      });
    },
    fetchLodging: async (id) => {
      await run(async () => {
        const [lodging, roomTypes, rooms, images] = await Promise.all([
          api<Lodging>(`/api/lodgings/${id}`), api<RoomType[]>(`/api/lodgings/${id}/room-types`),
          api<Room[]>(`/api/lodgings/${id}/rooms`), api<LodgingImage[]>(`/api/lodgings/${id}/images`),
        ]);
        set({ lodging, roomTypes, rooms, images });
      });
    },
    saveLodging: (id, body) => run(() => api<Lodging>(id ? `/api/lodgings/${id}` : "/api/lodgings", { method: id ? "PATCH" : "POST", json: body })),
    deleteLodging: async (id) => (await run(() => api(`/api/lodgings/${id}`, { method: "DELETE" }))) !== null,
    uploadImage: async (lodgingId, file, isCover) => {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("isCover", String(isCover));
      if (await run(() => api(`/api/lodgings/${lodgingId}/images`, { method: "POST", body: fd }))) await reloadLodging();
    },
    saveRoomType: async (id, body) => {
      if (await run(() => api(id ? `/api/room-types/${id}` : "/api/room-types", { method: id ? "PATCH" : "POST", json: body }))) await reloadLodging();
    },
    deleteRoomType: async (id) => { if (await run(() => api(`/api/room-types/${id}`, { method: "DELETE" }))) await reloadLodging(); },
    addRoom: async (body) => { if (await run(() => api("/api/rooms", { method: "POST", json: body }))) await reloadLodging(); },
    deleteRoom: async (id) => { if (await run(() => api(`/api/rooms/${id}`, { method: "DELETE" }))) await reloadLodging(); },
  };
});
