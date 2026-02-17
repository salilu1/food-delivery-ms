import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Option A: If you want the gateway to point to /auth
// This makes the health check available at http://localhost:4001/auth/health
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

router.use("/", authRoutes); 

app.use("/auth", router);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`✅ Auth-service running on http://localhost:${PORT}`);
});