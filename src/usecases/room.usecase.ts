import { z } from "zod";
import * as roomService from "@/services/room.service";
import * as roomTypeService from "@/services/room-type.service";
import { HttpError } from "@/lib/http";

export const stayQuerySchema = z.object({
  roomTypeId: z.coerce.number().int().positive(),
  checkIn: z.iso.date("Pick a check-in date."),
  checkOut: z.iso.date("Pick a check-out date."),
}).refine((v) => v.checkOut > v.checkIn, { message: "Check-out must be after check-in." });

export async function listRoomsByLodgingUseCase(lodgingId: number) {
  return roomService.listRoomsByLodging(lodgingId);
}

export async function createRoomUseCase(body: unknown) {
  const input = z.object({
    roomTypeId: z.coerce.number().int().positive(),
    number: z.string().trim().min(1).max(10),
    floor: z.coerce.number().int().min(0).max(200),
  }).parse(body);
  const type = await roomTypeService.getRoomType(input.roomTypeId);
  if (!type) throw new HttpError(404, "Room type not found.");
  try {
    return await roomService.createRoom({ ...input, lodgingId: type.lodgingId });
  } catch {
    throw new HttpError(409, `Room ${input.number} already exists here.`);
  }
}

export async function deleteRoomUseCase(id: number) {
  try {
    if (!(await roomService.deleteRoom(id))) throw new HttpError(404, "Room not found.");
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(409, "This room has bookings and can't be deleted.");
  }
  return { deleted: true };
}

export async function findAvailableRoomsUseCase(query: unknown) {
  const q = stayQuerySchema.parse(query);
  return roomService.findAvailableRooms(q.roomTypeId, q.checkIn, q.checkOut);
}
