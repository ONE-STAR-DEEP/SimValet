"use client";

import { createOrder } from "@/lib/order";
import { verifyPayment } from "@/lib/actions/payment";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import socket from "@/lib/socket/socket";

export default function PayButton({ invoiceId }: { invoiceId: string }) {
    const router = useRouter();

    const loadScript = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) return resolve(true);

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {

        const res = await loadScript();
        if (!res) return alert("Razorpay SDK failed");

        const orderRes = await createOrder(invoiceId);

        if (!orderRes.success) {
            alert("Something went wrong");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            order_id: orderRes.order.id,
            amount: orderRes.order.amount,
            currency: "INR",

            method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true,
            },

            prefill: {
                id: invoiceId,
            },

            handler: async (response: any) => {
                console.log("here")
                const verifyRes = await verifyPayment({
                    ...response,
                    invoiceId,
                });

                if (verifyRes.success) {
                    alert("Payment Successful ✅");
                    router.refresh();

                    socket.emit("payment-update", {
                        invoiceId: invoiceId,
                    });

                } else {
                    alert("Payment verification failed ❌");
                }
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    return <Button variant={'outline'} className="bg-white border border-primary" onClick={handlePayment}>Pay Now</Button>;
}