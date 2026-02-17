import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/order";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/orders", orderRoutes);
app.get("/health", (_req, res) => {
  res.json({ service: "order-service", status: "ok" });
});

const PORT = process.env.PORT || 4003;
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "*" }, // for testing in Node
});

// --- SOCKET.IO ROOM LOGIC ---
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client joins a room with their customerId
  socket.on("joinRoom", (customerId: string) => {
    socket.join(customerId);
    console.log(`Socket ${socket.id} joined room ${customerId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`order-service running on http://localhost:${PORT}`);
});
