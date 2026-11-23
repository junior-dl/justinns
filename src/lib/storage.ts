import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucket = process.env.S3_BUCKET ?? "justinns-images";

let client: S3Client | null = null;
function s3() {
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    });
  }
  return client;
}

/** Public URL of an object in the public-read Neon bucket. */
export function imageUrl(key: string | null | undefined): string {
  if (!key) return "/placeholder.svg";
  if (key.startsWith("http") || key.startsWith("/")) return key;
  // Seed illustrations are drawn by the app until `npm run images:upload` copies them
  // into the bucket and SEED_IMAGES_IN_STORAGE=true is set.
  if (key.startsWith("seed/") && process.env.SEED_IMAGES_IN_STORAGE !== "true") return `/api/seed-images/${key.slice(5)}`;
  const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}`;
  return `${base}/${key}`;
}

export async function uploadObject(key: string, body: Uint8Array, contentType: string) {
  await s3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return key;
}
