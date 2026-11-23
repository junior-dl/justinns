import type { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { findAvailableRoomsUseCase } from "@/usecases/room.usecase";

export const GET = handle(async (req: NextRequest) => findAvailableRoomsUseCase(Object.fromEntries(req.nextUrl.searchParams)));
