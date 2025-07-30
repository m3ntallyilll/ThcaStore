import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/queryClient';
import type { AuthUser, LoginRequest, InsertUser } from '@shared/schema';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
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
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        try {
          const response = await apiRequest('POST', '/api/auth/login', credentials);
          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      register: async (userData: InsertUser) => {
        try {
          const response = await apiRequest('POST', '/api/auth/register', userData);
          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            get().logout();
          }
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
