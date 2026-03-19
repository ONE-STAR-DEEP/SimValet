"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { generateOTP } from "../otp";
import { ActivityParams, LocationManager, ValetBoyData, ValetBoyDetails } from "../types/types";
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

        const otp = "123456"
        // await generateOTP();
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

    redirect("/company/valetLocationManager/dashboard");
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

export const fetchValetBoyData = async (search?: string) => {
    const conn = await db.getConnection();

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const company_id = session.company_id;
        const location_id = session.id;

        let query = `
            SELECT *
            FROM valet_boy
            WHERE company_id = ?
            AND valet_location_id = ?
        `;

        const params: (string | number)[] = [company_id, location_id];

        if (search) {
            query += ` AND (valet_boy_name LIKE ? OR mobile LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY id DESC`;

        const [rows] = await conn.execute(query, params);

        return {
            success: true,
            data: rows as ValetBoyDetails[]
        };

    } catch (error: any) {
        console.error("Fetch Valet Boy Error:", error);

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

        const location_id = session.id

        const [rows]: any = await conn.execute(
            `
            SELECT *
            FROM location_manager
            WHERE id = ?
        `, [location_id]
        );

        return {
            success: true,
            data: rows[0] as LocationManager
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

export const getActivityData = async (params: ActivityParams = {}) => {
    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const location_id = session.id;
        const company_id = session.company_id;

        const page = params.page || 1;
        const limit = params.limit || 20;
        const offset = (page - 1) * limit;

        const startDate = params.startDate;
        const endDate = params.endDate;

        // 🔹 Base filter (important)
        let filterQuery = `WHERE valet_location_id = ?`;
        const values: any[] = [location_id];

        // 🔹 Date filter (for DATA only)
        if (startDate && endDate) {
            filterQuery += ` AND entry_time BETWEEN ? AND ?`;
            values.push(startDate, endDate);
        }

        // =========================
        // 1. STATS QUERY
        // =========================
        const [statsRows]: any = await db.query(`
  SELECT
    today_entries,
    today_exits,
    yesterday_entries,
    yesterday_exits,
    active_vehicles,
    CONCAT(
  FLOOR(avg_val), 'h ',
  FLOOR((avg_val - FLOOR(avg_val)) * 60), 'm'
) AS avg_duration_today,

    --  ENTRY % CHANGE
    CASE 
  WHEN yesterday_entries = 0 AND today_entries > 0 THEN 100
  WHEN yesterday_entries = 0 AND today_entries = 0 THEN 0
  ELSE ROUND(((today_entries - yesterday_entries) * 100.0) / yesterday_entries, 2)
END AS entry_percent_change,

    --  EXIT % CHANGE
    CASE 
  WHEN yesterday_exits = 0 AND today_exits > 0 THEN 100
  WHEN yesterday_exits = 0 AND today_exits = 0 THEN 0
  ELSE ROUND(((today_exits - yesterday_exits) * 100.0) / yesterday_exits, 2)
END AS exit_percent_change

  FROM (
    SELECT 
      COUNT(CASE 
        WHEN entry_time >= CURDATE() 
         AND entry_time < CURDATE() + INTERVAL 1 DAY
        THEN 1 
      END) AS today_entries,

      COUNT(CASE 
        WHEN exit_time >= CURDATE() 
         AND exit_time < CURDATE() + INTERVAL 1 DAY
        THEN 1 
      END) AS today_exits,

      COUNT(CASE 
        WHEN entry_time >= CURDATE() - INTERVAL 1 DAY
         AND entry_time < CURDATE()
        THEN 1 
      END) AS yesterday_entries,

      COUNT(CASE 
        WHEN exit_time >= CURDATE() - INTERVAL 1 DAY
         AND exit_time < CURDATE()
        THEN 1 
      END) AS yesterday_exits,

      COUNT(CASE 
        WHEN exit_time IS NULL THEN 1 
      END) AS active_vehicles,

      AVG(CASE 
  WHEN exit_time >= CURDATE() 
   AND exit_time < CURDATE() + INTERVAL 1 DAY
  THEN total_duration_hrs * 1.0
END) AS avg_val

    FROM valet_activity
    WHERE valet_location_id = ? AND company_id = ?
  ) AS stats;
`, [location_id, company_id]);

        // =========================
        // 2. PAGINATED DATA
        // =========================
        const [dataRows]: any = await db.query(`
  SELECT 
    id,
    vehicle_number,
    owner_name,

    DATE_FORMAT(
  CONVERT_TZ(entry_time, '+00:00', '+05:30'),
  '%d %b %Y, %H:%i'
) AS entry_time,

DATE_FORMAT(
  CONVERT_TZ(exit_time, '+00:00', '+05:30'),
  '%d %b %Y, %H:%i'
) AS exit_time,

    CONCAT(
  FLOOR(total_duration_hrs / 24), 'd ',
  GREATEST(1, FLOOR(MOD(total_duration_hrs, 24))), 'h'
) AS total_duration,

    entry_by_valet,
    exit_by_valet

  FROM valet_activity
  ${filterQuery}
  ORDER BY entry_time DESC
  LIMIT ? OFFSET ?
`, [...values, limit, offset]);

        // =========================
        // 3. TOTAL COUNT (for pagination)
        // =========================
        const [countRows]: any = await db.query(`
      SELECT COUNT(*) as total
      FROM valet_activity
      ${filterQuery}
    `, values);

        return {
            success: true,
            data: {
                stats: statsRows[0],
                activities: dataRows,
                pagination: {
                    total: countRows[0].total,
                    page,
                    limit,
                    totalPages: Math.ceil(countRows[0].total / limit),
                }
            }
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch activity data",
        };
    }
}; 

export const deleteValetById = async (id: number) => {
    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const location_id = session.id;
        const company_id = session.company_id;

        const [result]: any = await db.query(
            `
            DELETE FROM valet_boy
            WHERE id = ? 
              AND company_id = ? 
              AND valet_location_id = ?
            `,
            [id, company_id, location_id]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Valet not found or already deleted",
            };
        }

        return {
            success: true,
            message: "Valet deleted successfully",
        };

    } catch (error: any) {
        console.error("Delete Valet Error:", error);

        return {
            success: false,
            message: error.message || "Something went wrong",
        };
    }
};