// Uploads the generated seed illustrations to the Neon object storage bucket: `npm run images:upload`
import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { allSeedImages } from "./lib/art";
import { lodgings } from "./lib/seed-data";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! },
  forcePathStyle: true,
});

const images = allSeedImages(lodgings);
for (const [key, body] of Object.entries(images)) {
  await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET ?? "justinns-images", Key: key, Body: body, ContentType: "image/svg+xml", CacheControl: "public, max-age=31536000" }));
}
console.log(`Uploaded ${Object.keys(images).length} images.`);
