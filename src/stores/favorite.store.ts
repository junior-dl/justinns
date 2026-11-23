import { create } from "zustand";
import { api } from "@/lib/api-client";

interface FavoriteState {
  ids: number[];
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (lodgingId: number) => Promise<void>;
  clear: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ids: [], loaded: false,
  async load() {
    try {
      set({ ids: await api<number[]>("/api/favorites"), loaded: true });
    } catch {
      set({ ids: [], loaded: true });
    }
  },
  async toggle(lodgingId) {
    const has = get().ids.includes(lodgingId);
    set({ ids: has ? get().ids.filter((i) => i !== lodgingId) : [lodgingId, ...get().ids] }); // optimistic
    try {
      if (has) await api(`/api/favorites/${lodgingId}`, { method: "DELETE" });
      else await api("/api/favorites", { method: "POST", json: { lodgingId } });
    } catch {
      set({ ids: has ? [lodgingId, ...get().ids] : get().ids.filter((i) => i !== lodgingId) });
    }
  },
  clear: () => set({ ids: [], loaded: false }),
}));
