import { z } from "zod";
import * as favoriteService from "@/services/favorite.service";
import { listLodgingsUseCase } from "./lodging.usecase";

const idSchema = z.coerce.number().int().positive();

export async function listFavoriteLodgingIdsUseCase(userId: string) {
  return favoriteService.listFavoriteLodgingIds(userId);
}

export async function listFavoriteLodgingsUseCase(userId: string) {
  const ids = new Set(await favoriteService.listFavoriteLodgingIds(userId));
  return (await listLodgingsUseCase({})).filter((l) => ids.has(l.id));
}

export async function addFavoriteUseCase(userId: string, lodgingId: unknown) {
  await favoriteService.addFavorite(userId, idSchema.parse(lodgingId));
  return { favorited: true };
}

export async function removeFavoriteUseCase(userId: string, lodgingId: unknown) {
  await favoriteService.removeFavorite(userId, idSchema.parse(lodgingId));
  return { favorited: false };
}
