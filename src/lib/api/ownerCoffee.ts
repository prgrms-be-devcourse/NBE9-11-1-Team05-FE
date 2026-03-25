import { Coffee, ApiRes, CoffeeUpdatePayload } from "@/types/ownerCoffee";

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
};

export const getCoffees = async (): Promise<ApiRes<Coffee[]>> => {
  const res = await fetch(`${getApiBaseUrl()}/coffees`, {
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);
  return result;
};

export const updateCoffee = async (
  id: number,
  payload: CoffeeUpdatePayload
): Promise<ApiRes<Coffee>> => {
  const res = await fetch(`${getApiBaseUrl()}/coffees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);
  return result;
};