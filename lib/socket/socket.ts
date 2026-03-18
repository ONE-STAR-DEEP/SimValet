"use client";

import { io, Socket } from "socket.io-client";

declare global {
  interface Window {
    socketInstance?: Socket;
  }
}

const socket =
  typeof window !== "undefined" && window.socketInstance
    ? window.socketInstance
    : io("https://simvaletpark.thavertech.com", {
        path: "/socket.io/",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

if (typeof window !== "undefined") {
  window.socketInstance = socket;
}

// Debug (remove later)
socket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});

export default socket;