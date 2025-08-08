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
      // Ensure guest ID is available for the request
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('guestId', guestId);
      }
      
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
      // Ensure guest ID is available for the request
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('guestId', guestId);
      }
      
      const result = await apiRequest('/api/cart', { 
        method: 'POST', 
        body: { productId, quantity } 
      });
      
      // If guest session, ensure guest ID is stored
      if (result.guestSession && result.userId) {
        localStorage.setItem('guestId', result.userId);
      }
      
      // Update cart items immediately for better UX
      await get().fetchCart();
      
      // Auto-open cart sidebar to show checkout button
      set({ isOpen: true });
      
      return result;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    // Debounce rapid updates
    const existingTimeout = (get() as any).updateTimeouts?.[itemId];
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Immediately update local state for responsive UI
    set(state => ({
      items: state.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    }));

    // Debounced API call
    const timeout = setTimeout(async () => {
      try {
        await apiRequest(`/api/cart/${itemId}`, { 
          method: 'PUT', 
          body: { quantity } 
        });
        // Clear timeout reference
        set(state => {
          const timeouts = { ...(state as any).updateTimeouts };
          delete timeouts[itemId];
          return { ...state, updateTimeouts: timeouts };
        });
      } catch (error) {
        console.error('Failed to update quantity:', error);
        // Revert to server state on error
        await get().fetchCart();
      }
    }, 500); // 500ms debounce

    // Store timeout reference
    set(state => ({
      ...state,
      updateTimeouts: {
        ...(state as any).updateTimeouts,
        [itemId]: timeout
      }
    }));
  },

  removeFromCart: async (itemId: string) => {
    // Check if item exists before attempting removal
    const currentItems = get().items;
    const itemExists = currentItems.find(item => item.id === itemId);
    
    if (!itemExists) {
      console.warn('Item already removed from cart:', itemId);
      return; // Don't throw error, just exit gracefully
    }

    // Immediately remove from local state for responsive UI
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));

    try {
      await apiRequest(`/api/cart/${itemId}`, { 
        method: 'DELETE' 
      });
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      
      // If 404, item was already removed, don't revert
      if (error.status !== 404) {
        // Only revert if it's not a 404 error
        await get().fetchCart();
        throw error;
      }
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
