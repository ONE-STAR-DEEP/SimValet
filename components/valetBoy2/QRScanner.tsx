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
import { Flashlight } from "lucide-react";

type QrScannerProps = {
    setExitData: React.Dispatch<React.SetStateAction<VehicleExit>>;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
};


export default function QrScannerComponent({ setExitData, setMode }: QrScannerProps) {
    const [open, setOpen] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const scannerRef = useRef<QrScanner | null>(null);

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.stop();
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
    };

    const toggleTorch = async () => {
        if (!scannerRef.current) return;

        try {
            await scannerRef.current.toggleFlash();
            setTorchOn(prev => !prev);
        } catch (e) {
            console.log("Torch error:", e);
        }
    };

    useEffect(() => {
        if (!open) return;

        const init = async () => {
            if (!videoRef.current) {
                console.log("Video not mounted yet");
                return;
            }

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
                }
            );

            scannerRef.current = scanner;

            try {
                await scanner.start();
                console.log("Camera started");

                const supported = await scanner.hasFlash();
                setHasTorch(supported);

            } catch (e) {
                console.error("Camera failed:", e);
            }
        };

        requestAnimationFrame(init);

        return () => {
            stopScanner();
        };
    }, [open]);

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
                <DialogContent className="max-h-[95vh] sm:max-w-sm p-0 overflow-hidden">
                    <DialogHeader className="hidden">
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[75vh] bg-black">

                        {/* 🔴 Camera */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                        />

                        {/* 🌑 Dark overlay with cutout */}
                        <div className="absolute inset-0 pointer-events-none">

                            {/* Top */}
                            <div className="absolute top-0 left-0 w-full h-[calc(50%-140px)] bg-black/70" />

                            {/* Bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-[calc(50%-140px)] bg-black/70" />

                            {/* Left */}
                            <div className="absolute top-[calc(50%-140px)] left-0 w-[calc(50%-150px)] h-70 bg-black/70" />

                            {/* Right */}
                            <div className="absolute top-[calc(50%-140px)] right-0 w-[calc(50%-150px)] h-70 bg-black/70" />

                        </div>

                        {/* 🎯 Scan box */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-white rounded-xl relative">

                                {/* ✨ Corner accents */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />

                                {/* 🔄 scanning line animation */}
                                <div className="absolute inset-0 overflow-hidden rounded-xl">
                                    <div className="w-full h-1 bg-green-400 animate-[scan_2s_linear_infinite]" />
                                </div>
                            </div>
                        </div>

                        {/* 📝 Top text */}
                        <div className="absolute top-4 left-0 w-full text-center text-white font-medium">
                            Scan Customer Slip
                        </div>

                        {!hasTorch && (
                            <button
                                onClick={toggleTorch}
                                className="absolute bottom-20 right-4 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm"
                            >
                                <Flashlight/>
                            </button>
                        )}

                        {/* ℹ️ Bottom hint */}
                        <div className="absolute bottom-6 left-0 w-full text-center text-white/80 text-sm px-4">
                            Align the QR code within the frame
                        </div>

                        {/* ❌ Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
                        >
                            ✕
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}