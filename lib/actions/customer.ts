'use server'

import db from "../dbPool";
import { VehicleData } from "../types/types";


export const customerLogin = async (vehicle: string, token: string) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT id
      FROM valet_activity
      WHERE vehicle_number = ? 
      AND token = ?
      AND exit_time IS NULL
      ORDER BY id DESC
      LIMIT 1;
      `,
      [vehicle.toUpperCase(), Number(token)]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return {
        success: false,
        message: "No active log found"
      };
    }

    return {
      success: true,
      id: result[0].id,
      message: "Success"
    };

  } catch (error) {
    console.error("customerLogin error:", error);
    return {
      success: false,
      message: "Server error"
    };
  }
};

export const vehicleData = async (id: number) => {
  try {
    const [rows] = await db.execute(
      `
        SELECT 
        va.id,
        va.vehicle_number,
        va.status,
        va.entry_time,

        vb.valet_boy_name,
        lm.location_name

        FROM valet_activity va

        LEFT JOIN valet_boy vb 
        ON va.entry_by_valet = vb.id

        LEFT JOIN location_manager lm 
        ON va.valet_location_id = lm.id

        WHERE va.id = ?;
      `,
      [id]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return {
        success: false,
        message: "No active log found"
      };
    }

    return {
      success: true,
      data: result[0] as VehicleData,
      message: "Success"
    };

  } catch (error) {
    console.error("customerLogin error:", error);
    return {
      success: false,
      message: "Server error"
    };
  }
};

export const requestCar = async (id: number) => {
  try {

    //  Get vehicle details
    const [rows]: any = await db.query(
      `SELECT id, company_id, vehicle_number, owner_name, assigned_valet
       FROM valet_activity
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return {
        success: false,
        message: "No record found",
        data: null as VehicleData | null
      };
    }

    const vehicle = rows[0];

    console.log(vehicle)

    if (vehicle.assigned_valet) {
      return {
        success: false,
        message: "Already Requested",
        data: null as VehicleData | null
      }
    }

    //  Insert request
    await db.query(
      `INSERT INTO requests (vehicle_number, customer_name, company_id)
       VALUES (?, ?, ?)`,
      [vehicle.vehicle_number, vehicle.owner_name, vehicle.company_id]
    );

    return {
      success: true,
      message: "Vehicle request sent",
      data: vehicle as VehicleData
    };

  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Database error",
      data: null as VehicleData | null
    };
  }
};
