export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface ApiRes<T> {
  message: string;
  data: T;
}

export interface OrdersSearchRequest {
  email: string;
  address: string;
  zipCode: string;
}

export interface OrdersSearchListRes {
  email: string;
  orders: OrdersSearchItemRes[];
}

export interface OrdersSearchItemRes {
  orderId: number;
  orderedAt: string;
  orderStatus: OrderStatus;
  orderLines: OrdersSearchLineItemRes[];
  address: string;
  zipCode: string;
  totalAmount: number;
}

export interface OrdersSearchLineItemRes {
  coffeeName: string;
  quantity: number;
  price: number;
}
