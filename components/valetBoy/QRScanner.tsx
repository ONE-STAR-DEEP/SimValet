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

export default function QrScanner({ setExitData, setMode }: QrScannerProps) {
  const [open, setOpen] = useState(false);
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
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (scanned) return;
            scanned = true;

            console.log("Scanned:", decodedText);

            let token;
            try {
              const url = new URL(decodedText);
              token = url.searchParams.get("token");
            } catch {
              token = decodedText;
            }

            const res = await verifyTokenAction(token || "");

            if (!res.success || !res.data) {
              console.log("Invalid token");
              return;
            }

            const payload = res.data;

            setExitData(prev => ({
              ...prev,
              vehicleNumber: payload.vehicle,
              token: payload.token,
            }));

            setMode("exit");

            navigator.vibrate?.(200);

            await qr.stop();
            setOpen(false);
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
        qrRef.current.stop().catch(() => {});
        qrRef.current = null;
      }
    };
  }, [open, setExitData, setMode]);

  return (
    <div>
      <Button className="w-full" onClick={() => setOpen(true)}>
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