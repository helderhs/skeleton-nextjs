'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { ApiResponse, UserResponse } from '@/types';

interface AuthRedirectOptions {
  redirectTo?: string;
}

interface UseAuthReturn {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    options?: AuthRedirectOptions
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    options?: AuthRedirectOptions
  ) => Promise<void>;
  logout: (options?: AuthRedirectOptions) => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserResponse | null;
}

const AuthContext = createContext<UseAuthReturn | null>(null);
const DEFAULT_AUTH_REDIRECT = '/dashboard';
const DEFAULT_LOGOUT_REDIRECT = '/login';

function getSafeRedirectPath(
  redirectTo: string | undefined,
  fallback: string
) {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return fallback;
  }

  return redirectTo;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const login = async (
    email: string,
    password: string,
    options?: AuthRedirectOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as ApiResponse<UserResponse>;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      setUser(data.data ?? null);
      router.replace(
        getSafeRedirectPath(options?.redirectTo, DEFAULT_AUTH_REDIRECT)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    options?: AuthRedirectOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = (await response.json()) as ApiResponse<UserResponse>;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      setUser(data.data ?? null);
      router.replace(
        getSafeRedirectPath(options?.redirectTo, DEFAULT_AUTH_REDIRECT)
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao cadastrar';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (options?: AuthRedirectOptions) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      router.replace(
        getSafeRedirectPath(options?.redirectTo, DEFAULT_LOGOUT_REDIRECT)
      );
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
