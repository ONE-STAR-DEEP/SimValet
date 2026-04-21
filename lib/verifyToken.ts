"use server";

import jwt from "jsonwebtoken";

type Payload = {
  vehicle: string;
  token: string;
};

export async function verifyTokenAction(token: string): Promise<{
  success: boolean;
  data?: Payload;
}> {
  if (!token) {
    return { success: false };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "vehicle" in decoded &&
      "token" in decoded
    ) {
      return {
        success: true,
        data: {
          vehicle: decoded.vehicle as string,
          token: decoded.token as string,
        },
      };
    }

    return { success: false };
  } catch (err) {
    console.error("JWT Error:", err);
    return { success: false };
  }
}