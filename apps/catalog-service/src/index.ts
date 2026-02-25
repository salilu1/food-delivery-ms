import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import catalogRoutes from "./routes/catalog";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// ✅ Serve uploaded images publicly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/catalog", catalogRoutes);

app.get("/health", (_req, res) => {
  res.json({ service: "catalog-service", status: "ok" });
});

const PORT = process.env.PORT || 4002;
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`catalog-service running on http://localhost:${PORT}`);
});
