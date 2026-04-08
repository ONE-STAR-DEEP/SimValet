"use client"

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRComponent() {
  const [qrSVG, setQrSVG] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const url = "https://simvaletpark.thavertech.com/customer-portal";

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