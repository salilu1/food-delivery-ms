import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./routes/cartRoute";

dotenv.config();

const app = express();

const allowedOrigins = ["http://172.24.111.254:5175"]; // frontend URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // important for cookies/auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.use("/cart", cartRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Cart service running on port ${process.env.PORT}`);
});