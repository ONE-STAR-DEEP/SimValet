"use server";

import Razorpay from "razorpay";
import type { Orders } from "razorpay/dist/types/orders";
import db from "./dbPool";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type CreateOrderResponse =
    | {
        success: true;
        order: Orders.RazorpayOrder;
    }
    | {
        success: false;
    };

export async function createOrder(
    invoiceId: string
): Promise<CreateOrderResponse> {
    try {

        const [rows]: any = await db.query(
            `SELECT id, payment_status, razorpay_order_id, entry_time, charge_rate
            FROM valet_activity
            WHERE id = ?`,
            [invoiceId]
        );

        if (!rows.length) {
            return {
                success: false
            };
        }

        const vehicle = rows[0];

        if (!vehicle.charge_rate || vehicle.charge_rate <= 0) {
            return { success: false };
        }

        const currentTime = new Date();

        const entryTime = new Date(
            new Date(vehicle.entry_time).toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
            })
        );

        const diffMs = Math.max(
            0,
            currentTime.getTime() - entryTime.getTime()
        );

        const diffHours = Math.max(
            1,
            Math.ceil(diffMs / (1000 * 60 * 60))
        );

        const payableAmount = diffHours * vehicle.charge_rate;

        if (vehicle.payment_status?.toUpperCase() === "PAID") {
            return {
                success: false,
            }
        }

        const order = await razorpay.orders.create({
            amount: Math.round(payableAmount * 100),
            currency: "INR",
            receipt: `invoice_${invoiceId}_${Date.now()}`,
        });

        await db.query(
            `UPDATE valet_activity set 
            razorpay_order_id = ?
            WHERE id = ?
            `, [order.id, invoiceId]
        );

        return { success: true, order };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}