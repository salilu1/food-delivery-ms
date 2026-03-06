import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL!;
const INTERNAL_SECRET = process.env.INTERNAL_SERVICE_SECRET!;

const api = axios.create({
  baseURL: ORDER_SERVICE_URL,
  timeout: 5000,
});

export async function confirmOrder(orderId: string) {
  try {
    await api.patch(
      `/orders/internal/${orderId}/pay`,
      {},
      {
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
        },
      }
    );
  } catch (err: any) {
    console.error("Failed to confirm order:", err?.response?.data || err.message);
    throw err;
  }
}

export async function failOrder(orderId: string) {
  try {
    await api.patch(
      `/orders/internal/${orderId}/fail`,
      {},
      {
        headers: {
          "x-internal-secret": INTERNAL_SECRET,
        },
      }
    );
  } catch (err: any) {
    console.error("Failed to fail order:", err?.response?.data || err.message);
    throw err;
  }
}