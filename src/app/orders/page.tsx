"use client";

import { useEffect, useState } from "react";
import OrderList from "@/app/orders/components/orderList";
import OrderDetail from "@/app/orders/components/orderDetail";
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

// 서버 날짜 -> yyyy-MM-dd  HH:mm:ss 형태로 반환
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
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectOrder = async (order: Order) => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  const changeStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status as any);
    } catch (e) {
      console.error(e);
    }
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

  // 전일 14시 ~ 당일 14시 필터
  const filterOrdersByTime = (orders: Order[]) => {
    const today14 = new Date();
    today14.setHours(14, 0, 0, 0);

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
        <OrderList
          orders={displayedOrders}
          onSelectOrder={handleSelectOrder}
          isChecked={isChecked}
          onToggleChecked={() => setIsChecked((prev) => !prev)}
          selectedOrder={selectedOrder}
        />
      </div>

      {/* 오른쪽 */}
      <div className="w-[35%] p-6 h-full overflow-hidden">
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