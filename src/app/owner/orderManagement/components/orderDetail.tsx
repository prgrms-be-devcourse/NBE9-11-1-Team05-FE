"use client";

import { Order } from "../page";

type Props = {
  order: Order;
  status?: string;
  onChangeStatus: (status: string) => void;
  onClose: () => void;
};

export default function OrderDetail({
  order,
  status,
  onChangeStatus,
  onClose,
}: Props) {
  const getButtonStyle = (type: string) => {
    return status === type
      ? "bg-[#4B3621] text-white"
      : "bg-[#C2A679] text-[#4B3621] hover:bg-[#4B3621] hover:text-white";
  };

  return (
    <div className="flex flex-col h-full gap-5 bg-white/40 p-5 rounded-md border border-[#C2A679]/40">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight">
          주문 상세 정보
        </h2>

        <div className="px-3 py-1 text-xs border border-[#C2A679] rounded-md bg-[#F5F5DC] font-medium">
          {status || "상품 준비중"}
        </div>
      </div>

      {/* Info */}
      <div className="text-sm flex flex-col gap-1 text-[#4B3621]/80">
        <span>주문번호: {order.id}</span>
        <span>이메일: {order.email}</span>
        <span>주문일자: {order.date}</span>
        <span>우편번호: {order.zip}</span>
        <span>주소: {order.address}</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between p-3 rounded-md bg-[#F5F5DC] border border-[#C2A679]/30"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-[#4B3621]/60">
                ₩{item.price.toLocaleString()} x {item.quantity}
              </div>
            </div>
            <div className="font-medium">
              ₩{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#C2A679]/40" />

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg">
        <span>최종 결제 금액</span>
        <span>₩{order.total.toLocaleString()}</span>
      </div>

      {/* Buttons */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-md transition ${getButtonStyle(
              "주문 취소"
            )}`}
            onClick={() => onChangeStatus("주문 취소")}
          >
            주문 취소
          </button>

          <button
            className={`flex-1 py-2 rounded-md transition ${getButtonStyle(
              "배송중"
            )}`}
            onClick={() => onChangeStatus("배송중")}
          >
            배송 시작
          </button>

          <button
            className={`flex-1 py-2 rounded-md transition ${getButtonStyle(
              "배송완료"
            )}`}
            onClick={() => onChangeStatus("배송완료")}
          >
            배송 완료
          </button>
        </div>

        <button
          className="w-full py-2 rounded-md bg-[#4B3621]/10 text-[#4B3621] hover:bg-[#4B3621]/20 transition"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}