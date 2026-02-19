export type JwtPayload = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
  iat: number;
  exp: number;
};

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};
