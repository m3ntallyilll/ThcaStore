import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
  } = {}
): Promise<any> {
  const { method = 'GET', body } = options;
  const token = localStorage.getItem('authToken');
  const guestId = localStorage.getItem('guestId');
  const headers: any = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (guestId) {
    headers['X-Guest-Id'] = guestId;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('authToken');
      // Don't redirect immediately - let the component handle it
      throw new Error('Authentication expired - please log in again');
    }

    await throwIfResNotOk(res);
    return await res.json();
  } catch (error) {
    // Silently handle auth errors to reduce console spam
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
      // Only throw auth error, don't log to console
      throw new Error('Authentication required - please log in again');
    }
    // Only log significant errors, avoid spam
    if (error && typeof error === 'object' && Object.keys(error).length > 0 && !(error as any).message?.includes('Authentication')) {
      console.error('API Request Error:', error);
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('authToken');
    const headers: any = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(queryKey.join("/") as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute instead of 30 seconds
      refetchIntervalInBackground: false,
      retry: (failureCount, error: any) => {
        // Don't retry auth errors or client errors
        if (error?.message?.includes('401') || error?.message?.includes('403') || error?.message?.includes('Authentication')) {
          return false;
        }
        return failureCount < 1; // Max 1 retry for other errors
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry auth errors
        if (error?.message?.includes('401') || error?.message?.includes('403') || error?.message?.includes('Authentication')) {
          return false;
        }
        return failureCount < 1; // Max 1 retry for mutations
      },
    },
  },
});

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Silently handle known auth errors
    if (event.reason?.message?.includes('Authentication') || 
        event.reason?.message?.includes('401') || 
        event.reason?.message?.includes('403')) {
      event.preventDefault();
      return;
    }
    
    // Log other errors for debugging but don't spam console
    if (event.reason && typeof event.reason === 'object' && 
        !event.reason.message?.includes('Network error')) {
      console.warn('Unhandled promise rejection (handled):', event.reason.message || event.reason);
      event.preventDefault();
    }
  });
}

const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : 'http://localhost:5000'
);

export async function apiRequest2(method: string, endpoint: string, data?: any) {
  const token = localStorage.getItem('authToken');

  const config: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  if (data && method.toUpperCase() !== 'GET') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    return response;
  } catch (error) {
    // Silently handle auth errors, only log actual network issues
    if (!(error instanceof Error && (error.message.includes('401') || error.message.includes('403')))) {
      console.error('Network Error:', error);
    }
    throw new Error('Network error - please check your connection');
  }
}