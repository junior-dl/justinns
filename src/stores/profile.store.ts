import { create } from "zustand";
import { api } from "@/lib/api-client";

export interface Profile { id: string; name: string; email: string; phone: string | null; address: string | null; role: string; createdAt: string }
export interface MyReview { id: number; title: string; rating: number; comment: string; createdAt: string; lodgingName: string; lodgingSlug: string }

interface ProfileState {
  profile: Profile | null;
  reviews: MyReview[];
  saving: boolean;
  message: string | null;
  fetch: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  save: (body: Partial<Profile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null, reviews: [], saving: false, message: null,
  fetch: async () => set({ profile: await api<Profile>("/api/profile") }),
  fetchReviews: async () => set({ reviews: await api<MyReview[]>("/api/reviews") }),
  save: async (body) => {
    set({ saving: true, message: null });
    try {
      const p = await api<Partial<Profile>>("/api/profile", { method: "PATCH", json: body });
      set((s) => ({ profile: s.profile ? { ...s.profile, ...p } : null, saving: false, message: "Saved." }));
    } catch (e) {
      set({ saving: false, message: (e as Error).message });
    }
  },
}));
