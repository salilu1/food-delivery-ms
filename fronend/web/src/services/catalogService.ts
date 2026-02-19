import axios from "axios";
import { getToken } from "../utils/token";

const CATALOG_URL = import.meta.env.VITE_CATALOG_SERVICE_URL;

export type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
};

export async function fetchFoods(): Promise<Food[]> {
  const res = await axios.get(`${CATALOG_URL}/catalog/`);
  return res.data;
}

export async function deleteFood(foodId: string) {
  const token = getToken();

  const res = await axios.delete(`${CATALOG_URL}/catalog/${foodId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function createFood(formData: FormData) {
  const token = getToken();

  const res = await axios.post(`${CATALOG_URL}/catalog/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // IMPORTANT: do NOT manually set content-type for FormData
    },
  });

  return res.data;
}
