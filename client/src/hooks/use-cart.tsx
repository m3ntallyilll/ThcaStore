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
    set({ isLoading: true });
    try {
      // API request will handle both authenticated and guest users
      const items = await apiRequest('/api/cart');
      set({ items: items || [] });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    try {
      const result = await apiRequest('/api/cart', { 
        method: 'POST', 
        body: { productId, quantity } 
      });
      
      // If guest session, store guest ID
      if (result.guestSession && result.userId) {
        localStorage.setItem('guestId', result.userId);
      }
      
      // Update cart items immediately for better UX
      await get().fetchCart();
      
      return result;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      await apiRequest(`/api/cart/${itemId}`, { 
        method: 'PUT', 
        body: { quantity } 
      });
      
      // Immediately update the local state for better UX
      set(state => ({
        items: state.items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
      
      // Then sync with server
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert optimistic update on error
      await get().fetchCart();
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      await apiRequest(`/api/cart/${itemId}`, { 
        method: 'DELETE' 
      });
      
      // Immediately remove from local state
      set(state => ({
        items: state.items.filter(item => item.id !== itemId)
      }));
      
      // Then sync with server
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Revert optimistic update on error
      await get().fetchCart();
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await apiRequest('/api/cart/clear', { method: 'DELETE' });
      set({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Clear locally even if API fails
      set({ items: [] });
    }
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
