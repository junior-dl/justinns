"use client";
import { useEffect } from "react";
import { useLodgingStore } from "@/stores/lodging.store";
import type { LodgingType } from "@/lib/types";

export function useLodgings(filter: { type?: LodgingType | null; q?: string | null; all?: boolean } = {}) {
  const { list, listLoading, listError, fetchList } = useLodgingStore();
  const { type, q, all } = filter;
  useEffect(() => { fetchList({ type, q, all }); }, [fetchList, type, q, all]);
  return { lodgings: list, loading: listLoading, error: listError, reload: () => fetchList({ type, q, all }) };
}

export function useLodgingDetail(slug: string) {
  const { detail, detailLoading, detailError, fetchDetail, refreshReviews } = useLodgingStore();
  useEffect(() => { fetchDetail(slug); }, [fetchDetail, slug]);
  const current = detail?.lodging.slug === slug ? detail : null;
  return { detail: current, loading: detailLoading || (!current && !detailError), error: detailError, refreshReviews };
}
