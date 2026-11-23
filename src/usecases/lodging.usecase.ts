import { z } from "zod";
import * as lodgingService from "@/services/lodging.service";
import { imageUrl, uploadObject } from "@/lib/storage";
import { HttpError } from "@/lib/http";

const typeSchema = z.enum(["hotel", "inn", "pension"]);

export const lodgingInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: typeSchema,
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(2).max(300),
  tagline: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().min(10),
  amenities: z.array(z.string().trim().min(1)).default([]),
  checkInTime: z.string().regex(/^\d{2}:\d{2}$/).default("14:00"),
  checkOutTime: z.string().regex(/^\d{2}:\d{2}$/).default("12:00"),
  isPublished: z.boolean().default(true),
});

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function listLodgingsUseCase(params: { type?: string | null; q?: string | null; includeUnpublished?: boolean }) {
  const type = params.type ? typeSchema.parse(params.type) : undefined;
  const rows = await lodgingService.listLodgings({ type, q: params.q?.trim() || undefined, includeUnpublished: params.includeUnpublished });
  return rows.map(({ coverKey, ...r }) => ({
    ...r,
    coverUrl: imageUrl(coverKey),
    fromPrice: r.fromPrice ? Number(r.fromPrice) : null,
    rating: r.rating ? Number(r.rating) : null,
  }));
}

export async function getLodgingBySlugUseCase(slug: string) {
  const row = await lodgingService.getLodgingBySlug(slug);
  if (!row || !row.isPublished) throw new HttpError(404, "Lodging not found.");
  return row;
}

export async function getLodgingByIdUseCase(id: number) {
  const row = await lodgingService.getLodgingById(id);
  if (!row) throw new HttpError(404, "Lodging not found.");
  return row;
}

export async function getLodgingRatingUseCase(lodgingId: number) {
  const r = await lodgingService.getLodgingRating(lodgingId);
  return { rating: r?.rating ? Math.round(Number(r.rating) * 10) / 10 : null, reviewCount: Number(r?.reviewCount ?? 0) };
}

export async function listLodgingImagesUseCase(lodgingId: number) {
  const rows = await lodgingService.listLodgingImages(lodgingId);
  return rows.map((r) => ({ id: r.id, alt: r.alt, isCover: r.isCover, url: imageUrl(r.storageKey) }));
}

export async function createLodgingUseCase(body: unknown) {
  const input = lodgingInputSchema.parse(body);
  let slug = slugify(input.name);
  for (let i = 2; await lodgingService.slugExists(slug); i++) slug = `${slugify(input.name)}-${i}`;
  return lodgingService.createLodging({ ...input, slug });
}

export async function updateLodgingUseCase(id: number, body: unknown) {
  const input = lodgingInputSchema.partial().parse(body);
  const row = await lodgingService.updateLodging(id, input);
  if (!row) throw new HttpError(404, "Lodging not found.");
  return row;
}

export async function deleteLodgingUseCase(id: number) {
  if (!(await lodgingService.deleteLodging(id))) throw new HttpError(404, "Lodging not found.");
  return { deleted: true };
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function addLodgingImageUseCase(lodgingId: number, file: File | null, isCover: boolean) {
  if (!file) throw new HttpError(400, "Choose an image to upload.");
  if (!ALLOWED.includes(file.type)) throw new HttpError(400, "Images must be JPEG, PNG or WebP.");
  if (file.size > 5 * 1024 * 1024) throw new HttpError(400, "Images must be 5 MB or smaller.");
  await getLodgingByIdUseCase(lodgingId);
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const key = `lodgings/${lodgingId}/${crypto.randomUUID()}.${ext}`;
  await uploadObject(key, new Uint8Array(await file.arrayBuffer()), file.type);
  const row = await lodgingService.addLodgingImage({ lodgingId, storageKey: key, alt: file.name, isCover });
  return { ...row, url: imageUrl(key) };
}
