"use server";

import crypto from "crypto";
import db from "../dbPool";
import Razorpay from "razorpay";

export async function verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    invoiceId: string;
}) {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        invoiceId,
    } = data;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return { success: false, message: "Invalid signature" };
    }

    const [rows]: any = await db.query(
        `SELECT id, payment_status, razorpay_order_id
            FROM valet_activity
            WHERE id = ?`,
        [invoiceId]
    );

    if (!rows.length) {
        return {
            success: false,
            message: "No record found"
        };
    }

    const vehicle = rows[0];

    if (!vehicle.razorpay_order_id) {
        return {
            success: false,
            message: "Order ID missing in DB"
        };
    }

    if (vehicle.razorpay_order_id !== razorpay_order_id) {
        return {
            success: false,
            message: "Order Mismatch"
        };
    }

    if (vehicle.payment_status?.toUpperCase() === "PAID") {
        return {
            success: false,
            message: "Already Paid"
        }
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.fetch(razorpay_order_id);

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (order.currency !== "INR" || payment.currency !== "INR") {
        return { success: false, message: "Invalid currency" };
    }

    if (payment.status !== "captured") {
        return { success: false, message: "Payment not captured" };
    }

    if (payment.order_id !== razorpay_order_id) {
        return { success: false, message: "Payment does not belong to order" };
    }

    if (payment.amount !== order.amount) {
        return { success: false, message: "Amount mismatch" };
    }

    await db.query(
        `
            UPDATE valet_activity set 
            payment_status = "PAID",  
            razorpay_payment_id = ?,
            paid_at = NOW()
            WHERE id = ? AND payment_status != 'PAID'
            `, [razorpay_payment_id, invoiceId]
    );

    return { success: true };

}