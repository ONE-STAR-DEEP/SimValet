"use server"

import { headers } from "next/headers";
import { isRateLimited } from "../rateLimiter";
import { ContactFormData } from "../types/types";
import db from "../dbPool";

export const submitContactForm = async (data: ContactFormData, formStart: number) => {


    try {

        const headersList = await headers();

        const forwarded = headersList.get("x-forwarded-for");
        const ip =
            forwarded?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "unknown";

        let score = 0;
        // Rate limit check
        if (isRateLimited(ip)) {
            score += 3;
        }

        const timeTaken = Date.now() - formStart;
        const tooFast = timeTaken < 1500;


        if (data.website) score += 3;
        if (data.idea) score += 3;
        if (tooFast) score += 2;

        if (score >= 3) {
            return { success: true };
        }

        const userAgent = headersList.get("user-agent");

        const query = `
            INSERT INTO contact_messages 
            (first_name, last_name, email, phone, subject, message, ip_address, user_agent)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const res = await db.execute(query, [
            data.firstName,
            data.lastName,
            data.email,
            data.phone,
            data.subject,
            data.message,
            ip,
            userAgent
        ]);

        return { success: true };

    } catch (error) {
        console.log(error)
        return {success: false}
    }
}