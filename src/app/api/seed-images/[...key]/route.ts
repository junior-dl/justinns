import type { NextRequest } from "next/server";
import { allSeedImages } from "../../../../../scripts/lib/art";
import { lodgings } from "../../../../../scripts/lib/seed-data";

const images = allSeedImages(lodgings);

export async function GET(_req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  const svg = images[`seed/${(await ctx.params).key.join("/")}`];
  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400, immutable" } });
}
