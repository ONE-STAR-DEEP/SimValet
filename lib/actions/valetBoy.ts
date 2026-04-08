"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "../dbPool";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2";
import { getSessionUser } from "../checkSession";
import { VehicleEntry } from "../types/types";
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
            WHERE vehicle_number = ? AND company_id = ?
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

        const [charges]: any = await db.execute(
            `
            SELECT charge_rate, min_charges
            FROM location_manager
            WHERE id = ? AND company_id = ?
            `,
            [locationId, companyId]
        );

        const query = `
            INSERT INTO valet_activity (entry_by_valet, valet_location_id, company_id, vehicle_number, token, owner_name, owner_mobile, charge_rate, min_charges)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const res = await db.execute(query, [
            valetId,
            locationId,
            companyId,
            carNumber,
            entryData.token,
            entryData.owner,
            entryData.mobile,
            charges[0].charge_rate,
            charges[0].min_charges
        ]);

        return {
            success: true,
            message: "Entry Success"
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error as string
        }
    }
}

export const exitEntry = async (vehicleNumber: string, token: string, mode: string) => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const valetId = session.id;

    try {

        const [rows]: any = await db.execute(
            `
            SELECT va.id
            FROM valet_activity va
            JOIN valet_boy vb 
                ON vb.id = ? 
                AND vb.company_id = ?
                AND vb.valet_location_id = va.valet_location_id
            WHERE va.vehicle_number = ?
            AND va.company_id = ?
            AND va.exit_time IS NULL
            AND va.token = ?
            ORDER BY va.entry_time DESC
            LIMIT 1
            `,
            [valetId, companyId, vehicleNumber.toUpperCase(), companyId, token]
        );

        if (!rows.length) {
            return {
                success: false,
                message: "Invalid token or no active vehicle"
            };
        }

        const entryId = rows[0].id;

        await db.execute(
            `
            UPDATE valet_activity
            SET exit_time = NOW(),
                exit_by_valet = ?,
                status = ?,
                mode_of_payment = ?
            WHERE id = ?
            `,
            [valetId, "Delivered", mode, entryId]
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

export const getPendingRequests = async () => {
    try {

        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;
        const userId = session.id;

        const [location]: any = await db.execute(
            `
            SELECT valet_location_id
            FROM valet_boy
            WHERE id = ? AND company_id = ?
        `,
            [userId, companyId]
        );

        if (!location.length) {
            return {
                success: false,
                message: "Valet location not found"
            };
        }

        const valetLocationId = location[0].valet_location_id;

        const [rows]: any = await db.query(
            `
      SELECT 
    r.id,
    r.vehicle_number,
    v.id AS activity_id,
    v.owner_name AS customer_name,
    r.request_time
FROM requests r
JOIN valet_activity v
    ON v.vehicle_number = r.vehicle_number
    AND v.id = (
        SELECT MAX(id)
        FROM valet_activity
        WHERE vehicle_number = r.vehicle_number
    )
WHERE r.status = 'pending'
    AND r.company_id = ?
    AND v.valet_location_id = ?
    AND r.request_time >= NOW() - INTERVAL 10 MINUTE
ORDER BY r.request_time DESC;
      `,
            [companyId, valetLocationId]
        );

        return {
            success: true,
            data: rows
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            data: []
        };
    }
};

export const assignValet = async (requestId: number, vehicleNumber: string) => {
    try {

        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;
        const userId = session.id;

        const conn = await db.getConnection();

        try {

            await conn.beginTransaction();

            // assign valet ONLY if not already assigned
            const [activityResult]: any = await conn.query(
                `
        UPDATE valet_activity
        SET assigned_valet = ?,
        status = ?
        WHERE vehicle_number = ?
        AND company_id = ?
        AND assigned_valet IS NULL
        ORDER BY id DESC
        LIMIT 1
        `,
                [userId, "Valet Assigned", vehicleNumber, companyId]
            );

            if (activityResult.affectedRows === 0) {
                await conn.rollback();

                return {
                    success: false,
                    message: "Vehicle already assigned"
                };
            }

            // delete the request
            await conn.query(
                `
        DELETE FROM requests
        WHERE id = ?
        AND company_id = ?
        `,
                [requestId, companyId]
            );

            await conn.commit();

            return {
                success: true
            };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }

    } catch (error) {
        console.log(error);

        return {
            success: false
        };
    }
};

export const updateStatus = async (vehicleNumber: string, status: string) => {

    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;
        const userId = session.id;

        const [result]: any = await db.execute(
            `
            UPDATE valet_activity
            SET status = ?
            WHERE vehicle_number = ?
            AND company_id = ?
            AND assigned_valet = ?
            AND exit_time IS NULL
            ORDER BY id DESC
            LIMIT 1
            `,
            [status, vehicleNumber.toUpperCase(), companyId, userId]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "No active vehicle found"
            };
        }

        return {
            success: true,
            message: "Status updated"
        };

    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: "Failed to update"
        }
    }
}

export const fetchValeActivities = async ({
    limit = 10,
    offset = 0,
}: {
    limit?: number
    offset?: number
}) => {
    try {
        const session = await getSessionUser();
        if (!session) throw new Error("Unauthorized");

        const companyId = session.company_id;
        const userId = session.id;

        const [rows]: any = await db.query(
            `
  SELECT *
  FROM (
    SELECT 
        vehicle_number,
        entry_time AS time,
        'ENTRY' AS type
    FROM valet_activity
    WHERE company_id = ?
      AND entry_by_valet = ?

    UNION ALL

    SELECT 
        vehicle_number,
        exit_time AS time,
        'EXIT' AS type
    FROM valet_activity
    WHERE company_id = ?
      AND exit_by_valet = ?
      AND exit_time IS NOT NULL
  ) AS combined
  ORDER BY time DESC
  LIMIT ? OFFSET ?
  `,
            [companyId, userId, companyId, userId, limit, offset]
        );

        return {
            success: true,
            data: rows
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Failed to fetch"
        };
    }
};

export const checkVehicle = async (vehicleNumber: string) => {

    const session = await getSessionUser();
    if (!session) throw new Error("Unauthorized");

    const companyId = session.company_id;
    const valetId = session.id;

    try {

        const [rows]: any = await db.execute(
            `
            SELECT va.id
            FROM valet_activity va
            JOIN valet_boy vb 
                ON vb.id = ? 
                AND vb.company_id = ?
                AND vb.valet_location_id = va.valet_location_id
            WHERE va.vehicle_number = ?
            AND va.company_id = ?
            AND va.exit_time IS NULL
            ORDER BY va.entry_time DESC
            LIMIT 1
            `,
            [valetId, companyId, vehicleNumber.toUpperCase(), companyId]
        );

        if (!rows.length) {
            return {
                success: false,
                message: "No active vehicle found"
            };
        }

        const entryId = rows[0].id;

        return {
            success: true,
            message: `Activity ID: ${rows[0].id}`

        }


    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
}