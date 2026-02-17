import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

dotenv.config();

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json()); // This is what was causing the proxy to hang

// 2. Service URLs (Fallback to localhost for your non-docker setup)
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const CATALOG_SERVICE = process.env.CATALOG_SERVICE_URL || "http://localhost:4002";

/**
 * Common Proxy Options
 * fixRequestBody is essential when using express.json() before a proxy
 */
const proxyOptions = {
  changeOrigin: true,
  onProxyReq: fixRequestBody, 
  onError: (err: { message: any; }, _req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
    console.error("Proxy Error:", err.message);
    res.status(502).json({ error: "Service unavailable or connection refused" });
  },
};

// 3. Routes & Proxying
// Logic: Requests to http://localhost:4000/auth/login -> http://localhost:4001/auth/login
app.use(
  "/auth",
  createProxyMiddleware({
    ...proxyOptions,
    target: AUTH_SERVICE,
  })
);

// Logic: Requests to http://localhost:4000/catalog/items -> http://localhost:4002/catalog/items
app.use(
  "/catalog",
  createProxyMiddleware({
    ...proxyOptions,
    target: CATALOG_SERVICE,
  })
);

// 4. Gateway Health Check
app.get("/health", (_req, res) => {
  res.json({ 
    service: "api-gateway", 
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// 5. Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`🔗 Proxying /auth to ${AUTH_SERVICE}`);
  console.log(`🔗 Proxying /catalog to ${CATALOG_SERVICE}`);
});