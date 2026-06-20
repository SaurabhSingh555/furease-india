export type OrderStatus = "New" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export type Product = {
  id: string;
  product_name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: string | null;
  stock: number | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type Order = {
  id: string;
  customer_name: string;
  mobile_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  product_name: string;
  quantity: number;
  payment_method: string;
  total_amount: number;
  status: OrderStatus;
  order_date: string;
};

export type OrderInsert = Omit<Order, "id" | "order_date">;

export type OrderFormFields = {
  customer_name: string;
  mobile_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};