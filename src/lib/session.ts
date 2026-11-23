import { headers } from "next/headers";
import { auth } from "./auth";
import { HttpError } from "./http";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const s = await getSession();
  if (!s) throw new HttpError(401, "Please log in first.");
  return s.user;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "admin") throw new HttpError(403, "Admins only.");
  return u;
}
