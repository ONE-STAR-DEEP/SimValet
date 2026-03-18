"use client";

import { useEffect } from "react";
import socket from "@/lib/socket/socket";

const SocketReconnect = () => {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (!socket.connected) {
          console.log("Reconnecting socket...");
          socket.connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null; // no UI
};

export default SocketReconnect;