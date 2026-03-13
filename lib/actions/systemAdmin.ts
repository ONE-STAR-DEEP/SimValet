"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { sendLoginOtpEmail } from "../email";
import { getSessionUser } from "../checkSession";
import { CompanyFormData } from "../types/types";
import { ResultSetHeader } from "mysql2";
import { generateOTP } from "../otp";

export async function sendOtp({ ...payload }: {
    email?: string;
    mobile?: string;
}) {

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `
            SELECT id, company_id, email
            FROM system_admin
            WHERE email = ? OR mobile = ?
            LIMIT 1
            `,
            [payload.email || null, payload.mobile || null]
        );

        if (rows.length === 0) {
            return {
                success: false,
                message: "Invalid Email or Mobile"
            }
        }

        const email = rows[0].email;
        const adminId = rows[0].id;
        const companyId = rows[0].company_id;

        const otp = "123456";
        // await generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const query = `
        INSERT INTO otps (company_id, user_id, identifier, otp, expires_at)
        VALUES (?, ?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            companyId,
            adminId,
            email,
            otp,
            expires_at
        ]);


        const sendingOTP = {
            success: true,
            message: "OTP Sent"
        }
        await sendLoginOtpEmail(email, otp);

        console.log(sendingOTP)


        if (!sendingOTP.success) {
            return {
                success: false,
                message: "Failed to send OTP"
            }
        }

        return {
            success: true,
            email: rows[0].email,
            message: "Otp Sent Successfully"
        }

    } catch (error) {

        return {
            success: false,
            message: "Failed to send OTP"
        }
    }
}

export const matchOTP = async (email: string, inputOTP: string) => {

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
        [email]
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

    redirect("/system-admin/dashboard");

};

export const insertCompany = async (data: CompanyFormData) => {
  const conn = await db.getConnection();

  try {
    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const {
      companyName,
      gstNo,
      email,
      address,
      country,
      state,
      city,
      pincode,
      contactPerson,
      personMobile,
      personDesignation
    } = data;

    const [result] = await conn.execute<ResultSetHeader>(
      `
      INSERT INTO company (
        name,
        gst,
        email,
        address,
        country,
        state,
        city,
        pin,
        contact_person_name,
        contact_person_mobile,
        contact_person_designation,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        companyName,
        gstNo.toUpperCase().trim(),
        email,
        address,
        country,
        state,
        city,
        pincode,
        contactPerson,
        personMobile,
        personDesignation,
        1 
      ]
    );

    return {
      success: true,
      insertId: result.insertId
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

export const fetchCompanies = async () => {
  const conn = await db.getConnection();

  try {
    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const [rows]: any = await conn.execute(
      `
      SELECT *
      FROM company
      ORDER BY id DESC
      `
    );

    return {
      success: true,
      data: rows as CompanyFormData 
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

export async function getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const conn = await db.getConnection();

    try {
        //  total count
        const [countResult]: any = await conn.query(
            `
            SELECT COUNT(*) as total
            FROM users
            WHERE BINARY role = 'admin'
            `
        );

        const total = countResult[0]?.total || 0;

        // 👉 main query
        const [rows]: any = await conn.query(
            `
           SELECT 
    k.id,
    k.company_name,
    u.name,
    u.email,
    u.mobile,
    u.role,
    k.created_at,
    COUNT(emp.id) AS employee_count
FROM kt_users k

-- admin user
LEFT JOIN users u
    ON u.company_id = k.id
    AND BINARY u.role = 'admin'

-- all employees
LEFT JOIN users emp
    ON emp.company_id = k.id

GROUP BY 
    k.id,
    k.company_name,
    u.name,
    u.email,
    u.mobile,
    u.role,
    k.created_at

ORDER BY k.id DESC
LIMIT ? OFFSET ?;
            `,
            [limit, offset]
        );

        return {
            success: true,
            data: rows || [],
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: "Failed to fetch users"
        };
    } finally {
        conn.release();
    }
}

export async function getCompanyByName(nameEncoded: string) {
    const conn = await db.getConnection();

    try {
        const [rows]: any = await conn.query(
            `
            SELECT 
                id,
                company_name 
            FROM kt_users
            WHERE company_name LIKE ?
            ORDER BY id DESC
            `,
            [`%${nameEncoded}%`]
        );

        return {
            success: true,
            data: rows || [],
        };

    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: "Failed to fetch companies"
        };
    } finally {
        conn.release();
    }
}

export async function getUsersByCompanyId({ company_id, page = 1, limit = 10 }: {
    company_id: number;
    page?: number;
    limit?: number;
}) {

    const offset = (page - 1) * limit;

    const conn = await db.getConnection();

    try {
        // total count first
        const [countResult]: any = await conn.query(
            `SELECT COUNT(*) as total 
         FROM users 
         WHERE company_id = ?`,
            [company_id]
        );

        const total = countResult[0].total;

        const [rows]: any = await conn.query(`
            SELECT 
                id,
                name,
                email,
                mobile,
                role,
                status,
                country,
                state,
                isd,
                city,
                type,
                created_at
            FROM users
            WHERE company_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `, [company_id, limit, offset]);

        return {
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: "Failed to fetch users"
        };
    } finally {
        conn.release();
    }
}

export async function deleteCompanyById(targetCompanyId: number) {
    try {
        const session = await getSessionUser();

        // only system admin can delete company users
        if (session.company_id !== 0) {
            redirect('/');
        }

        if (!targetCompanyId) throw new Error("Company id missing");

        await db.query(
            `DELETE FROM kt_users WHERE id = ?`,
            [targetCompanyId]
        );

        return { success: true };

    } catch (error) {
        console.log(error);
        return { success: false };
    }
}