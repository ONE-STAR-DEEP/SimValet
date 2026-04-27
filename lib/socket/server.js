import { Server } from "socket.io";

export const io = new Server(4001, {
  cors: {
    origin: "https://simvalet.thavertech.com",
    methods: ["GET", "POST"],
    credentials: true
  },

  pingInterval: 25000,
  pingTimeout: 120000,
});

console.log("Socket server running on port 4001");

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Join company room
  socket.on("join-company", (companyId) => {
    if (!companyId) return;

    socket.join(companyId);
    socket.data.companyId = companyId; // store for fallback

    console.log(`Socket ${socket.id} joined company ${companyId}`);
  });

  // Handle car request
  socket.on("car-request", (data) => {
    const companyId = data?.companyId || socket.data.companyId;

    if (!companyId) {
      console.log("No companyId provided");
      return;
    }

    console.log(`Request for company: ${companyId}`);

    // Emit ONLY to that company room
    io.to(companyId).emit("car-request", {
      success: data?.success,
      companyId
    });
  });

  socket.on("payment-update", (data) => {
    const invoiceId = data?.invoiceId;

    if (!invoiceId) {
      console.log("No invoiceId provided");
      return;
    }

    console.log(`Payment update for invoice: ${invoiceId}`);

    io.to(`valet-${invoiceId}`).emit("payment-update", {
      success: true,
      invoiceId: data?.invoiceId,
    });
  });

  socket.on("join-vehicle", (vehicle_number) => {
    if (!vehicle_number) return;

    socket.join(`vehicle-${vehicle_number}`);

    console.log(`Socket ${socket.id} joined vehicle ${vehicle_number}`);
  });

  socket.on("update-customer", (data) => {
    const { vehicle_number } = data;

    if (!vehicle_number) {
      console.log("No vehicle_number provided");
      return;
    }

    console.log(`Target vehicle: ${vehicle_number}`);

    io.to(`vehicle-${vehicle_number}`).emit("update-customer", data);
  });

  socket.on("join-valet", (invoiceId) => {
    if (!invoiceId) return;

    socket.join(`valet-${invoiceId}`);
    socket.data.invoiceId = invoiceId;

    console.log(`Socket ${socket.id} joined valet on ${invoiceId}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});