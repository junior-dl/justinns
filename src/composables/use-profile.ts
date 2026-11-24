"use client";
import { useEffect } from "react";
import { useProfileStore } from "@/stores/profile.store";

export function useProfile() {
  const s = useProfileStore();
  const { fetch, fetchReviews } = s;
  useEffect(() => {
    fetch().catch(() => {});
    fetchReviews().catch(() => {});
  }, [fetch, fetchReviews]);
  return s;
}
