import { Server } from "socket.io";

export const io = new Server(4001, {
  cors: { origin: "*" }
});

console.log("Socket server running on port 4001");

io.on("connection", (socket) => {
  console.log("Valet connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Valet disconnected:", socket.id);
  });
});