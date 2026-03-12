'use server'

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("session");

  if (!userCookie) return null;

  try {
    const payload = jwt.verify(
      userCookie.value,
      process.env.JWT_SECRET!
    ) as any;

    // create new token with refreshed expiry
    const newToken = jwt.sign(
      {
        id: payload.id,
        company_id: payload.company_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    // reset cookie expiry
    cookieStore.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return payload;

  } catch {
    return null;
  }
}