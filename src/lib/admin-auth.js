import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "gt_admin";

export const authConfigured = () => !!process.env.ADMIN_PASSWORD;

// the cookie value is an HMAC of the password, so changing ADMIN_PASSWORD logs everyone out
export const token = () =>
  createHmac("sha256", process.env.ADMIN_PASSWORD || "").update("ganivotech-admin-v1").digest("hex");

const digest = (s) => createHash("sha256").update(String(s)).digest();

export function passwordOk(input) {
  if (!authConfigured()) return false;
  return timingSafeEqual(digest(input || ""), digest(process.env.ADMIN_PASSWORD));
}

export function tokenOk(value) {
  if (!authConfigured() || !value) return false;
  return timingSafeEqual(digest(value), digest(token()));
}

export async function isAdmin() {
  return tokenOk((await cookies()).get(COOKIE)?.value);
}
