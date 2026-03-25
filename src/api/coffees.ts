export type Coffee = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
  };
  
  export type ApiRes<T> = {
    message: string;
    data: T;
  };
  
  export type CoffeeUpdatePayload = {
    name: string;
    description: string;
    price: number;
    quantity: number;
  };
  
  const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  };
  
  export const getCoffees = async (): Promise<ApiRes<Coffee[]>> => {
    const API_BASE_URL = getApiBaseUrl();
  
    const response = await fetch(`${API_BASE_URL}/coffees`, {
      cache: "no-store",
    });
  
    const result: ApiRes<Coffee[]> = await response.json();
  
    if (!response.ok) {
      throw new Error(result.message || "상품 목록 조회에 실패했습니다.");
    }
  
    return result;
  };
  
  export const updateCoffee = async (
    id: number,
    payload: CoffeeUpdatePayload
  ): Promise<ApiRes<Coffee>> => {
    const API_BASE_URL = getApiBaseUrl();
  
    const response = await fetch(`${API_BASE_URL}/coffees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    const result: ApiRes<Coffee> = await response.json();
  
    if (!response.ok) {
      throw new Error(result.message || "상품 수정에 실패했습니다.");
    }
  
    return result;
  };