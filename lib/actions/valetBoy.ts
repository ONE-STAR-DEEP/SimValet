"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { getSessionUser } from "../checkSession";
import { Location, VehicleEntry } from "../types/types";
import { generateOTP } from "../otp";
import { sendLoginOtpEmail } from "../email";

export async function sendOtp(mobile: string) {

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `
            SELECT id, company_id, mobile
            FROM valet_boy
            WHERE mobile = ?
            LIMIT 1
            `,
            [mobile]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "Invalid Mobile"
            }
        }


        const companyId = rows[0].company_id;
        const userId = rows[0].id;

        const otp = "123456"
        // await generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const query = `
        INSERT INTO otps (company_id, user_id, identifier, otp, expires_at)
        VALUES (?, ?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            companyId,
            userId,
            mobile,
            otp,
            expires_at
        ]);


        const sendingOTP = {
            success: true,
            message: "OTP Sent"
        }
        // await sendLoginOtpEmail(email, otp);

        if (!sendingOTP.success) {
            return {
                success: false,
                message: "Failed to send OTP"
            }
        }

        return {
            success: true,
            mobile: rows[0].mobile,
            message: "Otp Sent Successfully"
        }

    } catch (error) {

        console.log(error);

        return {
            success: false,
            message: "Failed to send OTP"
        }
    }
}

export const matchOTP = async (mobile: string, inputOTP: string) => {

    // Fetch latest valid OTP
    const [rows]: any = await db.execute(
        `
    SELECT id, otp, user_id, company_id, attempts
    FROM otps
    WHERE identifier = ?
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
    `,
        [mobile]
    );

    if (!rows.length) {
        return { success: false, errno: 410, message: "OTP expired or not found" };
    }

    const { id, otp, user_id, company_id, attempts } = rows[0];

    // Block after 3 attempts
    if (attempts > 3) {
        return { success: false, errno: 429, message: "Too many attempts. Try again later." };
    }

    // Increment attempts ALWAYS
    await db.execute(
        `UPDATE otps SET attempts = attempts + 1 WHERE id = ?`,
        [id]
    );

    // Compare OTP
    if (otp !== inputOTP) {
        return { success: false, errno: 401, message: "Invalid OTP" };
    }

    // Invalidate OTP after success
    await db.execute(
        `UPDATE otps SET expires_at = NOW() WHERE id = ?`,
        [id]
    );

    const token = jwt.sign(
        {
            id: Number(user_id),
            company_id: Number(company_id),
            lastActivity: Date.now(),
        },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" } //  
    );

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
    });

    redirect("/valet-boy/dashboard");

};

export const fetchLocationInfo = async () => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const userId = session.id;

    try {

        const [rows]: any = await db.execute(
            `
            SELECT valet_location_id, valet_boy_name, valet_boy_id, prk_lot_id
            FROM valet_boy
            WHERE id = ? AND company_id = ?
            `,
            [userId, companyId]
        );

        const locationId = rows[0].valet_location_id;

        const [location]: any = await db.execute(
            `
            SELECT id, location_name, contact_person_name
            FROM location_manager
            WHERE id = ? AND company_id = ?
            `,
            [locationId, companyId]
        );

        return {
            success: true,
            data: {
                ...rows[0],
                ...location[0]
            }
        };

    } catch (error) {
        return {
            success: false,
            message: error
        }

    }
}

export const submitEntry = async ({ entryData }: { entryData: VehicleEntry }) => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const valetId = session.id;

    const carNumber = entryData.vehicleNumber.toUpperCase();

    try {
        const [entryCheck]: any = await db.execute(
            `
            SELECT id
            FROM valet_activity
            WHERE car_number = ? AND company_id = ?
            AND exit_time IS NULL
            LIMIT 1;
            `,
            [carNumber, companyId]
        );

        if (entryCheck.length > 0) {
            return {
                success: false,
                message: "Failed to Insert! Entry Exist"
            }
        }

        const [rows]: any = await db.execute(
            `
            SELECT valet_location_id
            FROM valet_boy
            WHERE id = ? AND company_id = ?
            `,
            [valetId, companyId]
        );

        if (!rows.length) {
            return {
                success: false,
                message: "Valet location not found"
            };
        }

        const locationId = rows[0].valet_location_id;

        const query = `
            INSERT INTO valet_activity (entry_by_valet, valet_location_id, company_id, car_number, token, owner_name, owner_mobile)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            valetId,
            locationId,
            companyId,
            carNumber,
            `SVPT${entryData.token}`,
            entryData.owner,
            entryData.mobile
        ]);

        return {
            success: true,
            message: "Entry Success"
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }

    }
}

export const exitEntry = async (carNumber: string, token: string) => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const valetId = session.id;

    try {

        const [rows]: any = await db.execute(
            `SELECT valet_location_id
             FROM valet_boy
             WHERE id = ? AND company_id = ?`,
            [valetId, companyId]
        );

        if (!rows.length) {
            throw new Error("Valet not found");
        }

        const locationId = rows[0].valet_location_id;

        const [entryRows]: any = await db.execute(
            `
            SELECT id, token
            FROM valet_activity
            WHERE car_number = ?
            AND company_id = ?
            AND valet_location_id = ?
            AND exit_time IS NULL
            ORDER BY entry_time DESC
            LIMIT 1
            `,
            [carNumber, companyId, locationId]
        );

        if (!entryRows.length) {
            return {
                success: false,
                message: "No active vehicle found"
            };
        }

        const entry = entryRows[0];

        if (entry.token !== `SVPT${token}`) {
            return {
                success: false,
                message: "Invalid token"
            };
        }

        await db.execute(
            `
            UPDATE valet_activity
            SET exit_time = NOW(), exit_by_valet = ?
            WHERE id = ?
            `,
            [valetId, entry.id]
        );

        return {
            success: true,
            message: "Exit Success"
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Database error"
        };
    }
};

export const fetchEntryExitInfo = async () => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const userId = session.id;

    try {

        const [rows]: any = await db.execute(
            `
            SELECT valet_location_id
            FROM valet_boy
            WHERE id = ? AND company_id = ?
            `,
            [userId, companyId]
        );

        if (!rows.length) throw new Error("Valet not found");

        const locationId = rows[0].valet_location_id;

        const [activity]: any = await db.execute(
            `
            SELECT
                SUM(entry_by_valet = ?) AS entry_count,
                SUM(exit_by_valet = ?) AS exit_count
            FROM valet_activity
            WHERE company_id = ?
            AND valet_location_id = ?
            AND created_at >= CURDATE()
            AND created_at < CURDATE() + INTERVAL 1 DAY
            `,
            [userId, userId, companyId, locationId]
        );

        return {
            success: true,
            entryCount: activity[0].entry_count || 0,
            exitCount: activity[0].exit_count || 0
        };

    } catch (error) {
        return {
            success: false,
            message: error
        };
    }
};