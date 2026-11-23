"use client";
import { useEffect } from "react";
import { useProfileStore } from "@/stores/profile.store";

export function useProfile() {
  const s = useProfileStore();
  const { fetch } = s;
  useEffect(() => { fetch().catch(() => {}); }, [fetch]);
  return s;
}
