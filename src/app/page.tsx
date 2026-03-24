"use client";

import { useState } from "react";

export default function InventoryPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#efe8cf] px-6 py-8 text-[#3f2f1f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between border-b border-[#c9bca1] pb-4">
          <h1 className="text-2xl font-bold">The Artisanal Ledger</h1>
          <div className="text-sm font-semibold">Inventory Management</div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-md border border-[#d4c7aa] bg-[#f7f0de] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">재고 관리</h2>
                <p className="text-sm text-[#7b6b55]">원두 재고 현황 및 목록</p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="rounded border border-[#7a5d3f] px-3 py-2 text-sm font-semibold text-[#5b3f25]"
              >
                상품 수정 패널 보기
              </button>
            </div>

            <div className="flex min-h-[420px] items-center justify-center rounded-md border border-dashed border-[#ccbfa3] bg-[#fbf6e8] text-center text-[#8b7e67]">
              <div>
                <p className="text-lg font-semibold">상품 목록 영역</p>
                <p className="mt-2 text-sm">
                  현재는 UI 스켈레톤 단계입니다.
                  <br />
                  추후 전체 상품 조회 데이터가 이 영역에 표시됩니다.
                </p>
              </div>
            </div>
          </section>

          <section className="relative rounded-md border border-[#d4c7aa] bg-[#f7f0de] p-5">
            <h2 className="mb-4 text-2xl font-bold">상품 수정</h2>

            {isEditOpen ? (
              <form className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    원두 이름
                  </span>
                  <input
                    placeholder="예: 에티오피아 예가체프 G1"
                    className="w-full rounded border border-[#cbbda2] bg-[#fffaf0] px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    원두 가격 (원)
                  </span>
                  <input
                    type="number"
                    placeholder="예: 32000"
                    className="w-full rounded border border-[#cbbda2] bg-[#fffaf0] px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    보유 수량 (kg)
                  </span>
                  <input
                    type="number"
                    placeholder="예: 42.5"
                    className="w-full rounded border border-[#cbbda2] bg-[#fffaf0] px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    상품 설명
                  </span>
                  <textarea
                    rows={4}
                    placeholder="상품 설명이 들어갈 영역입니다."
                    className="w-full resize-none rounded border border-[#cbbda2] bg-[#fffaf0] px-3 py-2 text-sm outline-none"
                  />
                </label>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="w-full rounded bg-[#5b3f25] px-4 py-2 text-sm font-bold text-white"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="w-full rounded border border-[#8f7c62] px-4 py-2 text-sm font-bold"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-10 text-center text-[#7b6b55]">
                상품 수정 패널 UI 영역입니다.
                <br />
                현재는 백엔드 연결 없이 디자인만 구성한 상태입니다.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}