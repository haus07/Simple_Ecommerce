// checkoutLoader.ts
import api from "../axios/axios";

export async function checkoutLoader({ params }) {
  const { orderId } = params;

  if (!orderId) {
    throw new Response("Order ID missing", { status: 400 });
  }

  const accessToken = localStorage.getItem("access_Token");
  if (!accessToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    const response = await api.get(`orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.items; // loader return gì thì component nhận được qua useLoaderData
  } catch (error) {
    throw new Response("Failed to fetch order", { status: 500 });
  }
}
