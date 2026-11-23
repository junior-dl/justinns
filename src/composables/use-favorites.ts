"use client";
import { useEffect } from "react";
import { useFavoriteStore } from "@/stores/favorite.store";
import { useAuth } from "./use-auth";

export function useFavorites() {
  const { user } = useAuth();
  const { ids, loaded, load, toggle } = useFavoriteStore();
  useEffect(() => { if (user && !loaded) load(); }, [user, loaded, load]);
  return { ids, isFavorite: (id: number) => ids.includes(id), toggle, signedIn: !!user };
}
