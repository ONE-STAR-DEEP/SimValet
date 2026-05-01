"use client"

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { generateToken } from "@/lib/generateToken";

export default function QRComponent({ vehicle, token }: {
  vehicle: string
  token: string
}) {
  const [qrSVG, setQrSVG] = useState("");

  useEffect(() => {

    const generateQR = async () => {

      const signedToken = await generateToken({ vehicle, token })

      const url = `https://simvalet.com/customer-vehicle-portal?token=${encodeURIComponent(signedToken)}`;

      const svg = await QRCode.toString(url, {
        type: "svg",
      });

      setQrSVG(svg);
    };

    generateQR();
  }, []);

  return (
    <div className="w-[50%] bg-none" dangerouslySetInnerHTML={{ __html: qrSVG }} ></div>
  );
}