"use client";
import { useState } from "react";
import { api } from "@/lib/api-client";

export function useSubmitReview(onDone: () => Promise<void> | void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return {
    busy, error,
    async submit(body: { lodgingId: number; title: string; rating: number; comment: string }) {
      setBusy(true);
      setError(null);
      try {
        await api("/api/reviews", { method: "POST", json: body });
        await onDone();
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      } finally {
        setBusy(false);
      }
    },
  };
}
