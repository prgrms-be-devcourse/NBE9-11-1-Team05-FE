"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderList from "@/app/owner/orders/components/orderList";
import OrderDetail from "@/app/owner/orders/components/orderDetail";
import {
  getOwnerOrders,
  getOrderDetail,
  updateOrderStatus,
} from "@/lib/api/ownerOrders";

export type Order = {
  id: number;
  email: string;
  date: string;
  total: number;
  items: OrderItem[];
  address: string;
  zip: string;
};

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};

export default function OrderManagementPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOwnerOrders();

    const mapped = data.orders.map((o) => ({
      id: o.id,
      email: o.email,
      date: formatDate(o.orderedAt),
      total: o.totalAmount,
      items: [],
      address: "",
      zip: "",
    }));

    setOrders(mapped);
  };

  const handleSelectOrder = async (order: Order) => {
    const o = await getOrderDetail(order.id);

    const mapped = {
      id: o.ordersId,
      email: o.email,
      date: formatDate(o.orderedAt),
      total: o.coffeeList.reduce(
        (sum: number, item: any) =>
          sum + item.price * item.quantity,
        0
      ),
      zip: o.zipCode,
      address: o.address,
      items: o.coffeeList.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    setSelectedOrder(mapped);

    setOrderStatuses((prev) => ({
      ...prev,
      [o.ordersId]: o.orderStatus,
    }));
  };

  const changeStatus = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status as any);
  };

  const statusToKorean: any = {
    PROCESSING: "상품 준비중",
    SHIPPED: "배송중",
    DELIVERED: "배송완료",
  };

  const koreanToStatus: any = {
    배송중: "SHIPPED",
    배송완료: "DELIVERED",
  };

  // ✅ 다시 복구된 필터 로직
  const filterOrdersByTime = (orders: Order[]) => {
    const now = new Date();

    const today14 = new Date();
    today14.setHours(14, 0, 0, 0);

    // 현재 시간이 14시 이전이면 기준을 전날 14시로 맞춤
    if (now < today14) {
      today14.setDate(today14.getDate() - 1);
    }

    const start = new Date(today14);
    start.setDate(start.getDate() - 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= today14;
    });
  };

  const displayedOrders = isChecked
    ? filterOrdersByTime(orders)
    : orders;

  return (
    <div className="h-screen flex bg-[#F5F5DC] text-[#4B3621] overflow-hidden">
      
      {/* 왼쪽 */}
      <div className="w-[65%] p-6 flex flex-col border-r border-[#C2A679]/40 overflow-y-auto">

        <div className="text-3xl font-extrabold mb-6">Grid & Circles</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => router.push("/owner")}
            className="px-4 py-2 rounded-md border border-[#C2A679] bg-[#F5F5DC]"
          >
            재고 관리
          </button>
          <button className="px-4 py-2 rounded-md bg-[#4B3621] text-white">
            주문 관리
          </button>
        </div>

        <OrderList
          orders={displayedOrders}
          onSelectOrder={handleSelectOrder}
          isChecked={isChecked}
          onToggleChecked={() => setIsChecked((prev) => !prev)}
          selectedOrder={selectedOrder}
        />
      </div>

      {/* 오른쪽 */}
      <div className="w-[35%] p-6">
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            status={
              statusToKorean[orderStatuses[selectedOrder.id]] ??
              "상품 준비중"
            }
            onChangeStatus={async (uiStatus) => {
              const serverStatus = koreanToStatus[uiStatus];

              if (serverStatus) {
                await changeStatus(selectedOrder.id, serverStatus);

                setOrderStatuses((prev) => ({
                  ...prev,
                  [selectedOrder.id]: serverStatus,
                }));
              }
            }}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}