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
          localStorage.setItem('auth-token', data.token);
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

          localStorage.setItem('auth-token', data.token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        try {
          const user = await apiRequest('/api/auth/me', {
            method: 'GET'
          });
          set({ user, token });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('auth-token');
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);