'use client';

import { useState } from 'react';
import { deleteOrder, fetchOrders } from '@/lib/api/customerOrders';
import type { OrdersSearchRequest, OrdersSearchListRes } from '@/types/customerOrders';
import Link from 'next/link';

export default function OrderSearchPage() {
    const [form, setForm] = useState<OrdersSearchRequest>({
        email: '',
        address: '',
        zipCode: '',
    });

    const [result, setResult] = useState<OrdersSearchListRes | null>(null);

    const handleSearch = async () => {
        if (!form.email || !form.address || !form.zipCode) {
            alert('이메일, 주소, 우편번호를 모두 입력해주세요.');
            return;
        }

        try {
            const data = await fetchOrders(form);
            setResult(data);
        } catch (e) {
            alert((e as Error).message);
        }
    };

    const handleDelete = async (orderId: number) => {
        await deleteOrder(orderId);
        const data = await fetchOrders(form);
        setResult(data);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-7">

            <div className="flex justify-end mb-2">
                <Link href="/customer/coffees" className="text-sm text-coffee-mid hover:text-coffee-dark transition-colors">
                    주문 페이지로 →
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-coffee-dark mb-6">주문 조회</h1>

            {/* 검색 영역 */}
            <div className="border-2 border-coffee-dark rounded-xl p-4 mb-7">
                <div className="grid grid-cols-3 gap-3 mb-3">

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-coffee-mid">이메일</label>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={form.email}
                            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                            className="border border-coffee-mid rounded-full px-3 py-1.5 text-sm text-coffee-dark placeholder:text-coffee-mid outline-none focus:border-coffee-dark"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-coffee-mid">주소</label>
                        <input
                            type="text"
                            placeholder="주소"
                            value={form.address}
                            onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                            className="border border-coffee-mid rounded-full px-3 py-1.5 text-sm text-coffee-dark placeholder:text-coffee-mid outline-none focus:border-coffee-dark"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-coffee-mid">우편번호</label>
                        <input
                            type="text"
                            placeholder="00000"
                            maxLength={5}
                            value={form.zipCode}
                            onChange={e => setForm(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="border border-coffee-mid rounded-full px-3 py-1.5 text-sm text-coffee-dark placeholder:text-coffee-mid outline-none focus:border-coffee-dark"
                        />
                    </div>

                </div>

                {/* 주문 내역 조회 버튼 */}
                <button
                    onClick={handleSearch}
                    className="w-full py-2 border-2 border-coffee-dark rounded-full text-sm font-medium text-coffee-dark hover:bg-coffee-dark hover:text-coffee-light transition-colors"
                >
                    주문 내역 조회
                </button>
            </div>

            {/* 결과 영역 */}
            <div className="flex items-baseline justify-between mb-4">
                <h1 className="text-2xl font-bold text-coffee-dark">주문 내역</h1>
                {result && <span className="text-sm text-coffee-mid">{result.email}</span>}
            </div>

            {/* 조회 전 */}
            {!result && (
                <div className="text-center py-12 text-coffee-mid">
                    이메일을 입력하고 주문 내역을 조회하세요.
                </div>
            )}

            {/* 조회 후 결과 없음 */}
            {result && result.orders.length === 0 && (
                <div className="text-center py-12 text-coffee-mid">
                    해당 이메일로 조회된 주문이 없습니다.
                </div>
            )}

            {/* 조회 후 결과 있음 */}
            {result && result.orders.length > 0 && (
                <div className="flex flex-col gap-4">
                    {result.orders.map(order => (
                        <div key={order.orderId} className="border-2 border-coffee-dark rounded-xl overflow-hidden">

                            {/* 카드 헤더 */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-coffee-mid">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-semibold text-coffee-dark">#{order.orderId}</span>
                                    <span className="text-xs text-coffee-mid">
                                        {new Date(order.orderedAt)
                                            .toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}</span>
                                </div>
                                <span className="text-sm font-bold text-coffee-mid">
                                    {order.orderStatus === 'PROCESSING' && '준비중'}
                                    {order.orderStatus === 'SHIPPED' && '배송중'}
                                    {order.orderStatus === 'DELIVERED' && '배송완료'}
                                </span>
                            </div>

                            {/* 주문 아이템 */}
                            {order.orderLines.map((line, idx) => (
                                <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-coffee-mid text-sm">
                                    <span className="font-medium text-coffee-dark">{line.coffeeName}</span>
                                    <span className="text-coffee-mid">{line.quantity}개 &nbsp; {(line.price * line.quantity).toLocaleString()}원</span>
                                </div>
                            ))}

                            {/* 배송지 */}
                            <div className="px-4 py-2.5 text-sm text-coffee-mid border-b border-dashed border-coffee-mid">
                                <strong className="text-coffee-dark font-semibold mr-1">배송지</strong>
                                {order.address} ({order.zipCode})
                            </div>

                            {/* 카드 푸터 */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <button
                                    onClick={() => handleDelete(order.orderId)}
                                    className="text-sm text-red-400 hover:text-red-600 transition-colors"
                                >
                                    주문 취소
                                </button>
                                <span className="text-base font-bold text-coffee-dark">
                                    총 {order.totalAmount.toLocaleString()} 원
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}