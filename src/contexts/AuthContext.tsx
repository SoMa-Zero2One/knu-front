'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (newToken: string) => {
    try {
      // 서버에서 토큰 검증
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newToken })
      });
      
      const result = await response.json();
      
      if (result.success && result.data.user) {
        setUser(result.data.user);
        setToken(newToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', newToken);
        }
      } else {
        console.error('토큰 검증 실패:', result.error);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // 브라우저에서 실행될 때만 localStorage 접근
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
          await login(savedToken);
        } else {
          setLoading(false);
        }
      }
    };
    
    initAuth();
  }, [login]);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
} 