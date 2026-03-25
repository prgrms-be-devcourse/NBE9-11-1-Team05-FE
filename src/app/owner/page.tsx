"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCoffees, updateCoffee } from "@/lib/api/ownerCoffee";
import { Coffee } from "@/types/ownerCoffee";

type CoffeeForm = {
  name: string;
  description: string;
  price: string;
  quantity: string;
};

export default function InventoryPage() {
  const router = useRouter();

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

      setMessage(result.message || "상품 수정 성공");
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
    <div className="h-screen flex bg-[var(--color-background)] text-[var(--color-coffee-dark)] overflow-hidden">

      {/* LEFT */}
      <div className="w-[65%] p-6 flex flex-col border-r border-[var(--color-coffee-mid)]/40 overflow-y-auto">

        <div className="text-3xl font-extrabold mb-6">
          Grid & Circles
        </div>

        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 rounded-md bg-[var(--color-coffee-dark)] text-white">
            재고 관리
          </button>

          <button
            onClick={() => router.push("/owner/orders")}
            className="px-4 py-2 rounded-md border border-[var(--color-coffee-mid)]"
          >
            주문 관리
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            로딩 중...
          </div>
        ) : (
          <ul className="space-y-3">
            {coffees.map((coffee) => {
              const isActive = selectedId === coffee.id;

              return (
                <li
                  key={coffee.id}
                  className={`flex items-center justify-between rounded-md border px-4 py-4 transition
                    ${
                      isActive
                        ? "bg-[var(--color-coffee-dark)] text-white"
                        : "bg-white/40 border-[var(--color-coffee-mid)]/40 hover:bg-white/60"
                    }
                  `}
                >
                  <div>
                    <div className="text-lg font-bold">{coffee.name}</div>
                    <div className="text-sm opacity-70">
                      {coffee.description}
                    </div>
                    <div className="text-sm mt-2">
                      ₩{coffee.price.toLocaleString()} / {coffee.quantity}개
                    </div>
                  </div>

                  <button
                    onClick={() => openEditPanel(coffee)}
                    className={`px-3 py-2 rounded-md border transition ${
                      isActive
                        ? "bg-white text-[var(--color-coffee-dark)]"
                        : "bg-[var(--color-coffee-mid)] text-[var(--color-coffee-dark)] hover:bg-[var(--color-coffee-dark)] hover:text-white"
                    }`}
                  >
                    수정하기
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-[35%] p-6">
        {isEditOpen && selectedCoffee && (
          <div className="h-full flex flex-col bg-white/40 p-5 rounded-md border border-[var(--color-coffee-mid)]/40">

            <div className="text-xl font-bold mb-4">상품 수정</div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">

              <div className="flex flex-col gap-4 flex-1">

                <div>
                  <div className="text-sm mb-1">원두 이름</div>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <div className="text-sm mb-1">원두 가격 (원)</div>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <div className="text-sm mb-1">보유 수량</div>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, quantity: e.target.value }))
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <div className="text-sm mb-1">상품 설명</div>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

              </div>

              {/* ✅ 메시지 위치 (버튼 바로 위) */}
              {message && (
                <div className="mb-2 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 text-center">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-2 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2 rounded-md border border-[var(--color-coffee-mid)] bg-white/40"
                >
                  닫기
                </button>

                <button
                  disabled={saving}
                  className="flex-1 py-2 rounded-md bg-[var(--color-coffee-dark)] text-white"
                >
                  저장하기
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}