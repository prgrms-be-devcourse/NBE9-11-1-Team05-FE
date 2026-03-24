"use client";

import { useState } from "react";
import OrderList from "./components/orderList";
import OrderDetail from "./components/orderDetail";

// types
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

const mockOrders: Order[] = [
  {
    id: 1001,
    email: "test1@email.com",
    date: "2026-03-24",
    total: 25000,
    zip: "12345",
    address: "Seoul Street 1",
    items: [
      { name: "원두 A", price: 10000, quantity: 1 },
      { name: "원두 B", price: 15000, quantity: 1 },
    ],
  },
  {
    id: 1002,
    email: "test2@email.com",
    date: "2026-03-23",
    total: 18000,
    zip: "54321",
    address: "Seoul Street 2",
    items: [{ name: "원두 C", price: 18000, quantity: 1 }],
  },
];

export default function OrderManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  // ⭐ 주문별 상태 저장
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>({});

  return (
    <div className="h-screen flex bg-[#F5F5DC] text-[#4B3621]">
      {/* LEFT */}
      <div className="w-[65%] p-6 flex flex-col border-r border-[#C2A679]/40">
        <OrderList
          orders={mockOrders}
          onSelectOrder={setSelectedOrder}
          isChecked={isChecked}
          onToggleChecked={() => setIsChecked((prev) => !prev)}
          selectedOrder={selectedOrder}
        />
      </div>

      {/* RIGHT */}
      <div className="w-[35%] p-6">
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            status={orderStatuses[selectedOrder.id]}
            onChangeStatus={(newStatus) =>
              setOrderStatuses((prev) => ({
                ...prev,
                [selectedOrder.id]: newStatus,
              }))
            }
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}