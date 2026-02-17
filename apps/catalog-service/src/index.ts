import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import catalogRoutes from "./routes/catalog";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// Serve static files from uploads folder
app.use("/uploads", express.static("uploads"));


app.use("/catalog", catalogRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "catalog-service", status: "ok" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`catalog-service running on http://localhost:${PORT}`);
});
