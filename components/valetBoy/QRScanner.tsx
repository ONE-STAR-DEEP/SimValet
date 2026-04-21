"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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

window.addEventListener("error", (e) => {
    console.log("GLOBAL ERROR:", e.error);
});

export default function QrScanner({ setExitData, setMode }: QrScannerProps) {
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState("");
    const qrRef = useRef<Html5Qrcode | null>(null);


    useEffect(() => {
        if (!open) return;

        const timeout = setTimeout(() => {
            const readerElement = document.getElementById("reader");
            if (!readerElement) return;

            const qr = new Html5Qrcode("reader");
            qrRef.current = qr;

            let scanned = false;

            Html5Qrcode.getCameras().then((devices) => {
                if (!devices.length) return;

                const backCamera = devices.find(d =>
                    d.label.toLowerCase().includes("back")
                );

                const cameraId = backCamera?.id || devices[0].id;

                qr.start(
                    cameraId,
                    { fps: 5, qrbox: { width: 250, height: 250 } },
                    async (decodedText) => {
                        if (scanned) return;
                        scanned = true;

                        try {
                            console.log("Scanned:", decodedText);

                            await qr.stop().catch(() => { });

                            let extractedToken = "";

                            try {
                                const url = new URL(decodedText);
                                extractedToken = url.searchParams.get("token") || "";
                            } catch {
                                extractedToken = decodedText;
                            }

                            if (!extractedToken) return;

                            // ✅ ONLY THIS
                            setToken(extractedToken);

                            navigator.vibrate?.(200);

                        } catch (err) {
                            console.error("SCAN ERROR:", err);
                        }
                    },
                    (err) => {
                        console.log("QR Error:", err);
                    }
                );
            });
        }, 300);

        return () => {
            clearTimeout(timeout);

            if (qrRef.current) {
                qrRef.current.stop().catch(() => { });
                qrRef.current = null;
            }
        };
    }, [open]);

    return (
        <div>
            <Button className="w-full" type="button" onClick={() => setOpen(true)}>
                Scan QR Code
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Scan Customer Slip</DialogTitle>
                    </DialogHeader>

                    <div className="relative w-full h-[70vh] bg-black rounded-xl">
                        {/* Camera */}
                        <div id="reader" className="absolute inset-0 z-0" />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}