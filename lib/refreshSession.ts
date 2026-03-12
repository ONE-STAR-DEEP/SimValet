// actions/refreshSession.ts
"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes

type SessionPayload = {
    id: number;
    company_id: string;
    lastActivity: number;
};

export async function refreshSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return;

    let payload: SessionPayload;

    try {
        payload = jwt.verify(
            session.value,
            process.env.JWT_SECRET!
        ) as SessionPayload;
    } catch {
        cookieStore.delete("session");
        return;
    }

    const now = Date.now();

    // Throttle refresh
    if (now - payload.lastActivity < REFRESH_THRESHOLD) return;

    const newToken = jwt.sign(
        {
            ...(payload.id && { id: payload.id }),
            company_id: payload.company_id,
            lastActivity: now,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    cookieStore.set("session", newToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
    });
}
