"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { getSessionUser } from "../checkSession";
import { CompanyFormData, LocationData, LocationDetails } from "../types/types";
import { generateOTP } from "../otp";


export async function sendCompanyOtp({ ...payload }: {
    email?: string;
    mobile?: string;
}) {

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `
            SELECT id, email
            FROM company
            WHERE email = ? OR contact_person_mobile = ?
            LIMIT 1
            `,
            [payload.email || null, payload.mobile || null]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "Invalid Email or Mobbile"
            }
        }

        const email = rows[0].email;
        const companyId = rows[0].id;

        const otp = "123456"
        // await generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const query = `
        INSERT INTO otps (company_id, identifier, otp, expires_at)
        VALUES (?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            companyId,
            email,
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
            identifier: rows[0].email,
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

export const matchCompanyOTP = async (email: string, inputOTP: string) => {

    // Fetch latest valid OTP
    const [rows]: any = await db.execute(
        `
        SELECT id, otp, company_id, attempts
        FROM otps
        WHERE identifier = ?
        AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
    `,
        [email]
    );

    if (!rows.length) {
        return { success: false, errno: 410, message: "OTP expired or not found" };
    }

    const { id, otp, company_id, attempts } = rows[0];

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

    redirect("/company/dashboard");

};

export const insertLocation = async (data: LocationData) => {
    const conn = await db.getConnection();

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;

        const values = [];

        for (let i = 0; i < data.locationCount; i++) {
            values.push([
                companyId,
                data.locationName[i],
                data.locationAddress[i],
                data.contactPerson[i],
                data.personMobile[i]
            ]);
        }

        await conn.query(
            `
            INSERT INTO location_manager (
            company_id,
            location_name,
            location_address,
            contact_person_name,
            contact_person_mobile
            )
            VALUES ?
            `,
            [values]
        );

        return {
            success: true,
            message: "Successfully inserted all locations"
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

export const fetchLocations = async (search?: string) => {

    const conn = await db.getConnection();

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");
        const companyId = session.company_id;

        let query = `
            SELECT *
            FROM location_manager
            WHERE company_id = ?
        `

        let params: any[] = [companyId]

        if (search) {
            query += ` AND location_name LIKE ?`
            params.push(`%${search}%`)
        }

        query += ` ORDER BY id DESC`

        const [rows] = await conn.execute(query, params)

        return {
            success: true,
            data: rows as LocationDetails[]
        }

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

export const fetchCompanyData = async () => {
  const conn = await db.getConnection();

  try {
    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;

    // Fetch company
    const [companyRows]: any = await conn.query(
      `SELECT * FROM company WHERE id = ?`,
      [companyId]
    );

    // Fetch location count
    const [locationCountRows]: any = await conn.query(
      `SELECT COUNT(*) as locationCount 
       FROM location_manager 
       WHERE company_id = ?`,
      [companyId]
    );

    return {
      success: true,
      data: {
        ...companyRows[0],
        locationCount: locationCountRows[0].locationCount,
      },
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  } finally {
    conn.release();
  }
};