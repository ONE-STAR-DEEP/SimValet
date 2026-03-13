"use client";

import { useEffect } from "react";

export default function StandaloneDetector() {
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (!isStandalone) return;

    let startY = 0;

    document.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
    });

    document.addEventListener(
      "touchmove",
      (e) => {
        const y = e.touches[0].clientY;

        if (window.scrollY === 0 && y > startY) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }, []);

  return null;
}