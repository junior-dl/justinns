import { z } from "zod";
import * as reviewService from "@/services/review.service";
import * as lodgingService from "@/services/lodging.service";
import { HttpError } from "@/lib/http";

const reviewSchema = z.object({
  lodgingId: z.coerce.number().int().positive(),
  title: z.string().trim().min(3, "Give your review a title.").max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Tell us a little more (10+ characters).").max(1000),
});

export async function listReviewsByLodgingUseCase(lodgingId: number) {
  return reviewService.listReviewsByLodging(lodgingId);
}

export async function hasStayedAtUseCase(userId: string, lodgingId: number) {
  return reviewService.hasStayedAt(userId, lodgingId, new Date().toISOString().slice(0, 10));
}

export async function createReviewUseCase(userId: string, body: unknown) {
  const input = reviewSchema.parse(body);
  if (!(await lodgingService.getLodgingById(input.lodgingId))) throw new HttpError(404, "Lodging not found.");
  if (!(await hasStayedAtUseCase(userId, input.lodgingId))) {
    throw new HttpError(403, "You can review a place once your stay has started.");
  }
  const row = await reviewService.createReview({ ...input, userId });
  if (!row) throw new HttpError(409, "You've already reviewed this place.");
  return row;
}

export async function listReviewsByUserUseCase(userId: string) {
  return reviewService.listReviewsByUser(userId);
}
