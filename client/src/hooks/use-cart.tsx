import { create } from 'zustand';
import { useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
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
    // Prevent concurrent removal attempts
    const state = get() as any;
    if (state.removingItems?.has(itemId)) {
      console.log('Already removing item:', itemId);
      return;
    }

    // Mark as removing
    set((state: any) => ({
      ...state,
      removingItems: new Set([...(state.removingItems || []), itemId])
    }));

    // Check if item exists before attempting removal
    const currentItems = get().items;
    const itemExists = currentItems.find(item => item.id === itemId);
    
    if (!itemExists) {
      console.warn('Item not found in cart:', itemId);
      // Clear removing flag
      set((state: any) => {
        const removing = new Set(state.removingItems);
        removing.delete(itemId);
        return { ...state, removingItems: removing };
      });
      return;
    }

    // Optimistically remove from UI immediately
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));

    try {
      await apiRequest(`/api/cart/${itemId}`, { 
        method: 'DELETE' 
      });
      
      // Success - clear removing flag
      set((state: any) => {
        const removing = new Set(state.removingItems);
        removing.delete(itemId);
        return { ...state, removingItems: removing };
      });
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      
      // Clear removing flag
      set((state: any) => {
        const removing = new Set(state.removingItems);
        removing.delete(itemId);
        return { ...state, removingItems: removing };
      });
      
      // If 404, item was already removed, don't revert
      if (error.status === 404 || error.message?.includes('404')) {
        console.log('Item already removed from server');
        return;
      }
      
      // For other errors, revert the UI
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    // Optimistically clear UI
    set({ items: [] });
    
    try {
      await apiRequest('/api/cart/clear', { method: 'DELETE' });
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      // Already cleared locally, no need to revert unless critical
      if (error.status >= 500) {
        // Server error - refetch to ensure consistency
        await get().fetchCart();
      }
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
