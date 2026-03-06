const PAYMENT_API = "http://127.0.0.1:4004/payments";

export async function initializePayment(orderId: string, token: string) {
  const res = await fetch(`${PAYMENT_API}/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    throw new Error("Payment initialization failed");
  }

  return res.json();
}