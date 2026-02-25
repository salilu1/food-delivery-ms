// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface JwtPayload {
//   userId: string;
//   role: string;
// }

// export const authenticate = (
//   req: Request & { user?: JwtPayload },
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as JwtPayload;

//     req.user = decoded;
  
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUserPayload {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret123"
    ) as AuthUserPayload;

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthUserPayload;

  if (!user || user.role !== "CUSTOMER") {
    return res.status(403).json({ error: "Customer access only" });
  }

  next();
};
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthUserPayload;

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};
