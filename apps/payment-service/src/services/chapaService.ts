import axios from "axios";

const CHAPA_BASE = "https://api.chapa.co/v1";

export async function initializeChapaPayment(data: {
  amount: number;
  email: string;
  name: string;
  tx_ref: string;
}) {
  const response = await axios.post(
    `${CHAPA_BASE}/transaction/initialize`,
    {
      amount: data.amount,
      currency: "ETB",
      email: data.email,
      first_name: data.name,
      tx_ref: data.tx_ref,
      callback_url: "http://localhost:4004/payments/webhook",
      return_url: "http://localhost:5173/payment-result",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  return response.data;
}

export async function verifyChapaPayment(tx_ref: string) {
  const response = await axios.get(
    `${CHAPA_BASE}/transaction/verify/${tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  return response.data;
}