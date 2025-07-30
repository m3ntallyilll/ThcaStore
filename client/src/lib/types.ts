export interface CartItemWithProduct {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    stock: number;
  };
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  activeUsers: number;
}
