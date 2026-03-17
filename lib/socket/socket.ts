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
    : io("http://localhost:4001", {
        transports: ["websocket"],
      });

if (typeof window !== "undefined") {
  window.socketInstance = socket;
}

export default socket;