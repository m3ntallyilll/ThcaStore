import { create } from 'zustand';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './use-auth';
import type { CartItemWithProduct } from '@/lib/types';

interface CartState {
  items: CartItemWithProduct[];
  isOpen: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    const { token } = useAuth.getState();
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const items = await response.json();
        set({ items });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    const { token } = useAuth.getState();
    if (!token) throw new Error('Authentication required');

    try {
      await apiRequest('POST', '/api/cart', { productId, quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { token } = useAuth.getState();
    if (!token) throw new Error('Authentication required');

    try {
      await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    const { token } = useAuth.getState();
    if (!token) throw new Error('Authentication required');

    try {
      await apiRequest('DELETE', `/api/cart/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  toggleCart: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    return subtotal * 0.09; // 9% tax rate
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = get().getTax();
    return subtotal + tax;
  },
}));
