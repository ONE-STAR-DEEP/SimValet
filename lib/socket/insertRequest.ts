import { io as Client } from "socket.io-client";

const socket = Client("http://localhost:4001");

export const requestCar = async (carNumber: string) => {

// Call Db server action
    

  socket.emit("car-request", {
    carNumber,
    time: Date.now()
  });
};