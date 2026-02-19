import { authApi } from "./api";

export const registerCustomer = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await authApi.post("/auth/register", data);
  return res.data; // { user, token }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await authApi.post("/auth/login", data);
  return res.data; // { user, token }
};
