import { handle } from "@/lib/http";
import { listActiveDiscountsUseCase } from "@/usecases/discount.usecase";

export const GET = handle(async () => listActiveDiscountsUseCase());
