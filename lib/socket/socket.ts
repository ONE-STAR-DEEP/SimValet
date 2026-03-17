"use client";

import { io } from "socket.io-client";

let socket: any;

if (!socket) {
  socket = io("http://localhost:4001", {
    transports: ["websocket"]
  });
}

export default socket;