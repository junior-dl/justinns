import { create } from "zustand";
import { api } from "@/lib/api-client";
import type { Lodging, LodgingCard, LodgingImage, LodgingType, Review, RoomType } from "@/lib/types";

interface Detail {
  lodging: Lodging; images: LodgingImage[]; roomTypes: RoomType[]; reviews: Review[];
  rating: { rating: number | null; reviewCount: number };
}

interface LodgingState {
  list: LodgingCard[];
  listLoading: boolean;
  listError: string | null;
  detail: Detail | null;
  detailLoading: boolean;
  detailError: string | null;
  fetchList: (filter?: { type?: LodgingType | null; q?: string | null; all?: boolean }) => Promise<void>;
  fetchDetail: (slug: string) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

export const useLodgingStore = create<LodgingState>((set, get) => ({
  list: [], listLoading: false, listError: null,
  detail: null, detailLoading: false, detailError: null,

  async fetchList(filter = {}) {
    set({ listLoading: true, listError: null });
    const qs = new URLSearchParams();
    if (filter.type) qs.set("type", filter.type);
    if (filter.q) qs.set("q", filter.q);
    if (filter.all) qs.set("all", "1");
    try {
      set({ list: await api<LodgingCard[]>(`/api/lodgings?${qs}`), listLoading: false });
    } catch (e) {
      set({ listError: (e as Error).message, listLoading: false });
    }
  },

  async fetchDetail(slug) {
    set({ detailLoading: true, detailError: null });
    try {
      const lodging = await api<Lodging>(`/api/lodgings/by-slug/${encodeURIComponent(slug)}`);
      const [images, roomTypes, reviews, rating] = await Promise.all([
        api<LodgingImage[]>(`/api/lodgings/${lodging.id}/images`),
        api<RoomType[]>(`/api/lodgings/${lodging.id}/room-types`),
        api<Review[]>(`/api/lodgings/${lodging.id}/reviews`),
        api<Detail["rating"]>(`/api/lodgings/${lodging.id}/rating`),
      ]);
      set({ detail: { lodging, images, roomTypes, reviews, rating }, detailLoading: false });
    } catch (e) {
      set({ detailError: (e as Error).message, detailLoading: false, detail: null });
    }
  },

  async refreshReviews() {
    const d = get().detail;
    if (!d) return;
    const [reviews, rating] = await Promise.all([
      api<Review[]>(`/api/lodgings/${d.lodging.id}/reviews`),
      api<Detail["rating"]>(`/api/lodgings/${d.lodging.id}/rating`),
    ]);
    set({ detail: { ...d, reviews, rating } });
  },
}));
