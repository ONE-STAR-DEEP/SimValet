"use client";

import { io } from "socket.io-client";

let socket: any;

if (!socket) {
  socket = io("https://simvaletpark.thavertech.com/", {
    transports: ["websocket"]
  });
}

export default socket;