import { z } from "zod";
import * as userService from "@/services/user.service";
import { HttpError } from "@/lib/http";

export async function getProfileUseCase(userId: string) {
  const p = await userService.getProfile(userId);
  if (!p) throw new HttpError(404, "Profile not found.");
  return p;
}

export async function updateProfileUseCase(userId: string, body: unknown) {
  const input = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().max(30).optional().nullable(),
    address: z.string().trim().max(300).optional().nullable(),
  }).parse(body);
  return userService.updateProfile(userId, input);
}
