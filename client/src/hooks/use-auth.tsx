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
        localStorage.removeItem('authToken');
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            set({ user: null, token: null });
            return;
        }

        try {
          const user = await apiRequest('/api/auth/me', {
            method: 'GET'
          });
          set({ user, token });
        } catch (error: any) {
          // Only clear token if it's actually invalid (401/403 errors)
          if (error.message.includes('401') || error.message.includes('403') || error.message.includes('expired') || error.message.includes('invalid') || error.message.includes('Authentication')) {
            localStorage.removeItem('authToken');
            set({ user: null, token: null });
          } else {
            // For network errors or other issues, keep the auth state but log warning
            console.warn('Auth check failed (keeping auth state):', error.message);
          }
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