"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { VehicleExit } from "@/lib/types/types";
import { verifyTokenAction } from "@/lib/verifyToken";

type QrScannerProps = {
    setExitData: React.Dispatch<React.SetStateAction<VehicleExit>>;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
};


export default function QrScannerComponent({ setExitData, setMode }: QrScannerProps) {
    const [open, setOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const scannerRef = useRef<QrScanner | null>(null);

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.stop();
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
    };

    const startScanner = () => {
        if (!videoRef.current || scannerRef.current) return;

        const scanner = new QrScanner(
            videoRef.current,
            async (result) => {
                const raw = result.data;

                let token = "";
                try {
                    const url = new URL(raw);
                    token = url.searchParams.get("token") || "";
                } catch {
                    token = raw;
                }

                if (!token) return;

                try {
                    const res = await verifyTokenAction(token);
                    if (!res?.success || !res?.data) return;

                    const payload = res.data;

                    setExitData((prev) => ({
                        ...prev,
                        vehicleNumber: payload.vehicle,
                        token: payload.token,
                    }));

                    setMode("exit");
                } catch (err) {
                    console.error("Verify failed:", err);
                    return;
                }

                stopScanner();
                setOpen(false);
                navigator.vibrate?.(200);
            },
            {
                preferredCamera: "environment",
                highlightScanRegion: true,
            }
        );

        scannerRef.current = scanner;

        scanner.start().catch((e) => {
            console.error("Camera start failed:", e);
        });
    };

    useEffect(() => {
        if (!open || !videoRef.current) return;

        const scanner = new QrScanner(
            videoRef.current,
            async (result) => {
                const raw = result.data;

                let token = "";
                try {
                    const url = new URL(raw);
                    token = url.searchParams.get("token") || "";
                } catch {
                    token = raw;
                }

                if (!token) return;

                try {
                    const res = await verifyTokenAction(token);
                    if (!res?.success || !res?.data) return;

                    const payload = res.data;

                    setExitData((prev) => ({
                        ...prev,
                        vehicleNumber: payload.vehicle,
                        token: payload.token,
                    }));

                    setMode("exit");
                } catch (err) {
                    console.error("Verify failed:", err);
                    return;
                }

                stopScanner();     // ✅ clean stop
                setOpen(false);    // ✅ close dialog
                navigator.vibrate?.(200);
            },
            {
                preferredCamera: "environment",
                highlightScanRegion: true,
            }
        );

        scannerRef.current = scanner;
        scanner.start();

        return () => {
            stopScanner();
        };
    }, [open, setExitData, setMode]);

    return (
        <div>
            <Button className="w-full" type="button" onClick={() => setOpen(true)}>
                Scan QR Code
            </Button>

            <Dialog
                open={open}
                onOpenChange={(val) => {
                    if (!val) stopScanner();
                    setOpen(val);
                }}
            >
                <DialogContent className="max-h-[90vh] sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Scan Customer Slip</DialogTitle>
                    </DialogHeader>

                    <div className="relative w-full h-[70vh] bg-black rounded-xl overflow-hidden">
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* optional overlay */}
                        <div className="absolute inset-0 border-4 border-white/40 rounded-xl pointer-events-none" />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}