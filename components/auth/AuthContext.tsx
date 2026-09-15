'use client';

import { createContext, useContext, useState, useEffect } from 'react';

import { apiRequest } from '@/lib/api';

import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  login(email: string, password: string): Promise<void>;

  register(data: { name: string; email: string; password: string; role: string }): Promise<void>;

  logout(): void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  /*
LOAD EXISTING SESSION
*/

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);

        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Invalid saved session', error);

        localStorage.removeItem('token');

        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const authData = response.data;

    setUser(authData.user);

    setToken(authData.token);

    localStorage.setItem('token', authData.token);

    localStorage.setItem('user', JSON.stringify(authData.user));

    return authData.user;
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    await apiRequest('/auth/register', {
      method: 'POST',

      body: JSON.stringify(payload),
    });
  }

  function logout() {
    setUser(null);

    setToken(null);

    localStorage.removeItem('token');

    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider
      value={{
        user,

        token,

        loading,

        login,

        register,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
