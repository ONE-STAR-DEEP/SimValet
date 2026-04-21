"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function QrScanner() {

    const [open, setOpen] = useState(false);

    useEffect(() => {

        if (!open) return;

        const qr = new Html5Qrcode("reader");

        Html5Qrcode.getCameras().then((devices) => {
            if (!devices.length) return;

            const backCamera = devices.find(d =>
                d.label.toLowerCase().includes("back")
            );
            const cameraId = backCamera?.id || devices[0].id;

            qr.start(
                cameraId,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    setOpen(false)
                    console.log("Scanned:", decodedText);

                    let token;
                    try {
                        const url = new URL(decodedText);
                        token = url.searchParams.get("token");
                    } catch {
                        token = decodedText;
                    }

                    console.log("Token:", token);

                    qr.stop();
                },
                (errorMessage) => {
                    // REQUIRED 4th argument
                    console.log("QR Error:", errorMessage);
                }
            );
        });

        return () => {
            qr.stop().catch(() => { });
        };
    }, [open]);

    return (
        <div>

            <Button type="button" onClick={() => { setOpen(true) }}>Scan QR Code</Button>

            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent className="
                max-h-[90vh]
                sm:max-w-sm
                ">
                    <DialogHeader>
                        <DialogTitle>Scan Customer Slip</DialogTitle>

                    </DialogHeader>
                    <div className="relative w-full h-[70vh] bg-black rounded-xl" >
                        {/* Camera */}
                        < div id="reader" className="absolute inset-0 z-0" />

                        {/* Overlay */}
                        < div className="absolute inset-0 z-10 flex items-center justify-center" >
                            <div className="relative w-65 h-65 border-2 border-white rounded-xl" >

                                {/* Animated scan line */}
                                < div className="absolute top-0 left-0 w-full h-1 bg-green-400 animate-scan" />

                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}