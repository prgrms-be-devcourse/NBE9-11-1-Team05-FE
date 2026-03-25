export type OwnerOrderItem = {
    id: number;
    email: string;
    orderedAt: string;
    totalAmount: number;
  };
  
  export type OwnerOrdersResponse = {
    orders: OwnerOrderItem[];
  };