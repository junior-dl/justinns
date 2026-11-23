"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { Discount } from "@/lib/types";

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  useEffect(() => { api<Discount[]>("/api/discounts").then(setDiscounts).catch(() => setDiscounts([])); }, []);
  return discounts;
}
