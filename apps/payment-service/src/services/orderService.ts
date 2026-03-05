import axios from "axios";

export async function confirmOrder(orderId: string) {
  await axios.patch(
    `${process.env.ORDER_SERVICE_URL}/internal/orders/${orderId}/confirm`,
    {},
    {
      headers: {
        "x-service-secret": process.env.INTERNAL_SERVICE_SECRET!,
      },
    }
  );
}

export async function failOrder(orderId: string) {
  await axios.patch(
    `${process.env.ORDER_SERVICE_URL}/internal/orders/${orderId}/fail`,
    {},
    {
      headers: {
        "x-service-secret": process.env.INTERNAL_SERVICE_SECRET!,
      },
    }
  );
}