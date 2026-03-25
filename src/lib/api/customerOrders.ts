import type { ApiRes, OrdersSearchRequest, OrdersSearchListRes } from '@/types/customerOrders';

export async function fetchOrders(request: OrdersSearchRequest): Promise<OrdersSearchListRes> {
  const params = new URLSearchParams({
    email: request.email,
    address: request.address,
    zipCode: request.zipCode,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/search?${params}`);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? '조회 실패');
  }

  const json: ApiRes<OrdersSearchListRes> = await res.json();
  return json.data;
}

export async function deleteOrder(orderId: number): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('삭제 실패');
}