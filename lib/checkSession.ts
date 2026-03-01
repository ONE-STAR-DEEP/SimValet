// lib/session.ts

'use server'
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const INACTIVITY_LIMIT = 60 * 60 * 1000;

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("session");

  if (!userCookie) return null;

  try {
    const payload = jwt.verify(
      userCookie.value,
      process.env.JWT_SECRET!
    ) as any;

    const inactiveTime = Date.now() - payload.lastActivity;

    if (inactiveTime > INACTIVITY_LIMIT) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}


export async function checkSession() {
  const user = await getSessionUser();
  return Boolean(user);
}