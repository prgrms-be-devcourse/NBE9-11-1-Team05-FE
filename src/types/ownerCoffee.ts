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