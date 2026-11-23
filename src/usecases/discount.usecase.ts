import * as discountService from "@/services/discount.service";
import { HttpError } from "@/lib/http";

export async function findActiveDiscountUseCase(code: string) {
  const row = await discountService.findActiveDiscount(code.trim());
  if (!row) throw new HttpError(404, "That code isn't valid.");
  return { code: row.code, percentOff: row.percentOff, description: row.description };
}

export async function listActiveDiscountsUseCase() {
  return discountService.listActiveDiscounts();
}
