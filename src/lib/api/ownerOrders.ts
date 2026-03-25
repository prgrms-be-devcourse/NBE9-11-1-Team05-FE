import { OwnerOrdersResponse } from "@/types/ownerOrders";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("BASE_URL", BASE_URL);

export const getOwnerOrders = async (): Promise<OwnerOrdersResponse> => {
  const res = await fetch(`${BASE_URL}/orders/owner/orderlist`);

  if (!res.ok) {
    throw new Error("주문 목록 조회 실패");
  }

  const json = await res.json();
  return json.data;
};

export const getOrderDetail = async (orderId: number) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`);

  if (!res.ok) {
    throw new Error("주문 상세 조회 실패");
  }

  const json = await res.json();
  return json.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: "PROCESSING" | "SHIPPED" | "DELIVERED"
) => {
  const res = await fetch(
    `${BASE_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("상태 변경 실패");
  }

  const json = await res.json();
  return json.data;
};