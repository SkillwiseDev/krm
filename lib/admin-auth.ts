import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24;

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function getSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET ?? password;

  if (!password || !secret) {
    return null;
  }

  return crypto
    .createHmac("sha256", secret)
    .update("admin-authenticated")
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = getSessionToken();

  if (!expected) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) {
    return false;
  }

  return safeCompare(session, expected);
}

export async function setAdminSession(): Promise<void> {
  const token = getSessionToken();

  if (!token) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  return safeCompare(password, adminPassword);
}
