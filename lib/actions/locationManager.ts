"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { generateOTP } from "../otp";
import { ValetBoyData, ValetBoyDetails } from "../types/types";
import { getSessionUser } from "../checkSession";


export async function sendManagerOtp({ ...payload }: {
    email?: string;
    mobile?: string;
}) {

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `
            SELECT id, contact_person_mobile, company_id
            FROM location_manager
            WHERE contact_person_mobile = ?
            LIMIT 1
            `,
            [payload.mobile || null]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "Invalid Credentials"
            }
        }

        const user_id = rows[0].id;
        const companyId = rows[0].company_id;
        const mobile = rows[0].contact_person_mobile;

        const otp = await generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const query = `
        INSERT INTO otps (company_id, user_id, identifier, otp, expires_at)
        VALUES (?, ?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            companyId,
            user_id,
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
            identifier: rows[0].contact_person_mobile,
            message: "Otp Sent Successfully"
        }

    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: "Failed to send OTP"
        }
    }
}

export const matchManagerOTP = async (mobile: string, inputOTP: string) => {

    // Fetch latest valid OTP

    console.log(mobile)
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
        { expiresIn: "1d" } //  
    );

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
    });

    redirect("/valetLocationManager/dashboard");
};

export const insertValetBoy = async (data: ValetBoyData) => {
    const conn = await db.getConnection();

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;
        const locationId = session.id;

        const values = [];

        for (let i = 0; i < data.count; i++) {
            values.push([
                companyId,
                locationId,
                data.name[i],
                data.valet_boy_id[i],
                data.prk_lot_id[i],
                data.mobile[i]
            ]);
        }

        await conn.query(
            `
            INSERT INTO valet_boy (
            company_id,
            valet_location_id,
            valet_boy_name,
            valet_boy_id,
            prk_lot_id,
            mobile
            )
            VALUES ?
            `,
            [values]
        );

        return {
            success: true,
            message: "Successfully inserted all Valet boys"
        };

    } catch (error: any) {
        console.error("Insert Company Error:", error);

        return {
            success: false,
            message: error.message || "Something went wrong"
        };

    } finally {
        conn.release();
    }
};

export const fetchValetBoyData = async () => {
    const conn = await db.getConnection();

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const company_id = session.company_id;
        const location_id = session.id

        const [rows]: any = await conn.execute(
            `
      SELECT *
      FROM valet_boy
      WHERE company_id = ? and valet_location_id = ?
      ORDER BY id DESC
      `, [company_id, location_id]
        );

        return {
            success: true,
            data: rows as ValetBoyDetails[]
        };

    } catch (error: any) {
        console.error("Fetch Companies Error:", error);

        return {
            success: false,
            message: error.message || "Something went wrong"
        };

    } finally {
        conn.release();
    }
};

export const getLocationDetails = async () => {
    const conn = await db.getConnection();
    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const company_id = session.company_id;
        const location_id = session.id

        const [rows]: any = await conn.execute(
            `
      SELECT *
      FROM location_manager
      WHERE company_id = ? and valet_location_id = ?
      ORDER BY id DESC
      `, [company_id, location_id]
        );

        return {
            success: true,
            data: rows as ValetBoyDetails[]
        };

    } catch (error: any) {
        console.error("Fetch Companies Error:", error);

        return {
            success: false,
            message: error.message || "Something went wrong"
        };

    } finally {
        conn.release();
    }


}