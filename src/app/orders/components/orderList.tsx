"use client";

import { Order } from "../page";

type Props = {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  isChecked: boolean;
  onToggleChecked: () => void;
  selectedOrder: Order | null;
};

export default function OrderList({
  orders,
  onSelectOrder,
  isChecked,
  onToggleChecked,
  selectedOrder,
}: Props) {
  return (
    <>
      <div className="text-2xl font-bold mb-6 text-[#4B3621]">
        gird&circles
      </div>

      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 rounded-md border border-[#C2A679] text-[#4B3621] bg-[#F5F5DC] hover:bg-[#C2A679]/20 transition">
          재고 관리
        </button>
        <button className="px-4 py-2 rounded-md bg-[#4B3621] text-white shadow-sm">
          주문 관리
        </button>
      </div>

      <div className="mb-5">
        <div
          className="inline-flex items-center gap-2 cursor-pointer select-none text-sm font-medium"
          onClick={onToggleChecked}
        >
          <div className="w-4 h-4 border border-[#4B3621] rounded-sm flex items-center justify-center">
            <div
              className={`w-2 h-2 bg-[#4B3621] transition-opacity duration-150 ${
                isChecked ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <span className="text-[#4B3621]/80">
            전일 14시 ~ 당일 14시 주문 건 조회
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-2">
        {orders.map((order) => {
          const isActive = selectedOrder?.id === order.id;

          return (
            <div
              key={order.id}
              className={`flex justify-between p-4 rounded-md border transition
              ${
                isActive
                  ? "bg-[#4B3621] text-white border-[#4B3621]"
                  : "bg-white/40 border-[#C2A679]/40 hover:bg-white/60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold">#{order.id}</span>
                <span className="text-sm">{order.email}</span>
                <span
                  className={`text-xs ${
                    isActive ? "text-white/70" : "text-[#4B3621]/60"
                  }`}
                >
                  {order.date}
                </span>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => onSelectOrder(order)}
                  className={`px-3 py-2 text-sm rounded-md transition ${
                    isActive
                      ? "bg-white text-[#4B3621]"
                      : "bg-[#C2A679] text-[#4B3621] hover:bg-[#4B3621] hover:text-white"
                  }`}
                >
                  상세 보기
                </button>

                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-[#4B3621]"
                  }`}
                >
                  ₩{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}