"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Coffee, getCoffees, updateCoffee } from "@/api/coffees";

type CoffeeForm = {
  name: string;
  description: string;
  price: string;
  quantity: string;
};

export default function InventoryPage() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [form, setForm] = useState<CoffeeForm>({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedCoffee = useMemo(
    () => coffees.find((coffee) => coffee.id === selectedId) ?? null,
    [coffees, selectedId]
  );

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getCoffees();
        setCoffees(result.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("상품 목록 조회 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoffees();
  }, []);

  const openEditPanel = (coffee: Coffee) => {
    setSelectedId(coffee.id);
    setForm({
      name: coffee.name,
      description: coffee.description,
      price: String(coffee.price),
      quantity: String(coffee.quantity),
    });
    setIsEditOpen(true);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedId === null) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const result = await updateCoffee(selectedId, {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      setCoffees((prev) =>
        prev.map((coffee) =>
          coffee.id === selectedId ? result.data : coffee
        )
      );

      setForm({
        name: result.data.name,
        description: result.data.description,
        price: String(result.data.price),
        quantity: String(result.data.quantity),
      });

      setMessage(result.message || "상품 수정이 완료되었습니다.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("상품 수정 중 오류가 발생했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-coffee-light px-6 py-8 text-coffee-dark">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between border-b border-coffee-mid pb-4">
          <h1 className="text-2xl font-bold">Grids & Circles</h1>
          <div className="text-sm font-semibold">재고 관리</div>
        </header>

        {message && (
          <div className="rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-md border border-coffee-mid bg-[#fbf8ef] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">재고 관리</h2>
                <p className="text-sm text-[#7b6b55]">원두 재고 현황 및 목록</p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-md border border-dashed border-coffee-mid bg-white text-center text-[#8b7e67]">
                상품 목록을 불러오는 중입니다.
              </div>
            ) : coffees.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-md border border-dashed border-coffee-mid bg-white text-center text-[#8b7e67]">
                등록된 상품이 없습니다.
              </div>
            ) : (
              <ul className="space-y-3">
                {coffees.map((coffee) => (
                  <li
                    key={coffee.id}
                    className="flex items-center justify-between rounded-md border border-coffee-mid bg-white px-4 py-4"
                  >
                    <div className="flex-1">
                      <div className="text-lg font-bold">{coffee.name}</div>
                      <div className="mt-1 text-sm text-[#7b6b55]">
                        {coffee.description}
                      </div>
                      <div className="mt-2 flex gap-6 text-sm text-coffee-dark">
                        <span>가격: {coffee.price.toLocaleString()}원</span>
                        <span>수량: {coffee.quantity}개</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditPanel(coffee)}
                      className="rounded border border-coffee-dark px-3 py-2 text-sm font-semibold text-coffee-dark"
                    >
                      수정하기
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="relative rounded-md border border-coffee-mid bg-[#fbf8ef] p-5">
            <h2 className="mb-4 text-2xl font-bold">상품 수정</h2>

            {isEditOpen && selectedCoffee ? (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    원두 이름
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded border border-coffee-mid bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    원두 가격 (원)
                  </span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full rounded border border-coffee-mid bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    보유 수량
                  </span>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="w-full rounded border border-coffee-mid bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#7b6b55]">
                    상품 설명
                  </span>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full resize-none rounded border border-coffee-mid bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded bg-coffee-dark px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {saving ? "저장 중..." : "SAVE"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="w-full rounded border border-coffee-mid px-4 py-2 text-sm font-bold text-coffee-dark"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-10 text-center text-[#7b6b55]">
                수정할 상품을 선택해 주세요.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}