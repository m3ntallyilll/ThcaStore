import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/queryClient';
import type { AuthUser, LoginRequest, InsertUser } from '@shared/schema';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: credentials
          });

          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          });

          // Store token in localStorage for API requests
          localStorage.setItem('authToken', data.token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: InsertUser) => {
        set({ isLoading: true });
        try {
          const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: userData
          });

          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false 
          });

          localStorage.setItem('authToken', data.token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('guestId');
        set({ user: null, token: null });
        
        // Reload the page to reset all app state
        window.location.reload();
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          set({ user: null, token: null });
          return;
        }

        set({ isLoading: true });
        try {
          const data = await apiRequest('/api/auth/me', {
            method: 'GET'
          });
          
          set({ 
            user: data, 
            token,
            isLoading: false 
          });
        } catch (error: any) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          set({ 
            user: null, 
            token: null, 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);