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
          const response = await apiRequest('POST', '/api/auth/login', credentials);

          if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = 'Login failed';

            try {
              const jsonError = JSON.parse(errorData);
              errorMessage = jsonError.message || errorMessage;
            } catch {
              // If response is HTML or not JSON, use generic message
              errorMessage = 'Server error - please try again';
            }

            throw new Error(errorMessage);
          }

          const data = await response.json();

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
          const response = await apiRequest('POST', '/api/auth/register', userData);

          if (!response.ok) {
            const errorData = await response.text();
            let errorMessage = 'Registration failed';

            try {
              const jsonError = JSON.parse(errorData);
              errorMessage = jsonError.message || errorMessage;
            } catch {
              errorMessage = 'Server error - please try again';
            }

            throw new Error(errorMessage);
          }

          const data = await response.json();

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
          const response = await apiRequest('GET', '/api/auth/me');

          if (response.ok) {
            const user = await response.json();
            set({ user, token });
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth-token');
            set({ user: null, token: null });
          }
        } catch (error) {
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