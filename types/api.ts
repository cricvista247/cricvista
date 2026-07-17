export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobileNumber: number;
  subscriptionId: string;
  role: string;
  username: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface PlaceOrderRequest {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  price: number;
  status: "active" | "cancelled" | "expired";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface SubscriptionPurchaseRequest {
  planId: string;
  planName: string;
  price: number;
  duration: number; // in months
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
