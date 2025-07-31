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
  const headers: any = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
    console.error('API Request Error:', error);
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('Authentication required - please log in again');
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
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

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
    console.error('API Request Error:', error);
    throw new Error('Network error - please check your connection');
  }
}