import { z } from "zod";
import * as roomTypeService from "@/services/room-type.service";
import { imageUrl } from "@/lib/storage";
import { HttpError } from "@/lib/http";

export const roomTypeInputSchema = z.object({
  lodgingId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5),
  bed: z.string().trim().min(2).max(60),
  sizeSqm: z.coerce.number().int().positive(),
  maxPersons: z.coerce.number().int().min(1).max(12),
  pricePerNight: z.coerce.number().positive().max(1_000_000),
});

export async function listRoomTypesByLodgingUseCase(lodgingId: number) {
  const rows = await roomTypeService.listRoomTypesByLodging(lodgingId);
  return rows.map(({ imageKey, ...r }) => ({ ...r, pricePerNight: Number(r.pricePerNight), imageUrl: imageUrl(imageKey) }));
}

export async function getRoomTypeUseCase(id: number) {
  const row = await roomTypeService.getRoomType(id);
  if (!row) throw new HttpError(404, "Room type not found.");
  return { ...row, pricePerNight: Number(row.pricePerNight), imageUrl: imageUrl(row.imageKey) };
}

export async function createRoomTypeUseCase(body: unknown) {
  const input = roomTypeInputSchema.parse(body);
  return roomTypeService.createRoomType({ ...input, pricePerNight: input.pricePerNight.toFixed(2) });
}

export async function updateRoomTypeUseCase(id: number, body: unknown) {
  const input = roomTypeInputSchema.partial().parse(body);
  const row = await roomTypeService.updateRoomType(id, {
    ...input, pricePerNight: input.pricePerNight !== undefined ? input.pricePerNight.toFixed(2) : undefined,
  });
  if (!row) throw new HttpError(404, "Room type not found.");
  return row;
}

export async function deleteRoomTypeUseCase(id: number) {
  if (!(await roomTypeService.deleteRoomType(id))) throw new HttpError(404, "Room type not found.");
  return { deleted: true };
}
