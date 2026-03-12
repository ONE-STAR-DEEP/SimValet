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

    return payload;

  } catch (error) {
    console.log(error);
    return null;
  }
}