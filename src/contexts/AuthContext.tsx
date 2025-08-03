'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithUUID: (uuid: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loginWithUUID = useCallback(async (uuid: string) => {
    try {
      // 백엔드 API로 직접 토큰 요청
      const response = await fetch('https://api.knu.soma.wibaek.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      });
      
      if (!response.ok) {
        console.error('토큰 API 요청 실패:', response.status);
        const errorText = await response.text();
        console.error('응답 내용:', errorText);
        setLoading(false);
        return;
      }
      
      const responseData = await response.json();
      
      const { accessToken, token_type, id, nickname} = responseData;

      if (accessToken) {
        setToken(accessToken);
        // 사용자 정보 설정
        setUser({ id, nickname });
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', accessToken);
          localStorage.setItem('user_info', JSON.stringify({ id, nickname }));
        }
        // 로그인 성공 후 dashboard로 리다이렉트
        router.push('/dashboard');
      } else {
        console.error('UUID 로그인 실패: access_token이 없습니다.', { accessToken, token_type, id, nickname });
      }
    } catch (error) {
      console.error('UUID 로그인 오류:', error);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // 브라우저에서 실행될 때만 localStorage 접근
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
          setToken(savedToken);
          // localStorage에서 사용자 정보도 불러오기
          const savedUserInfo = localStorage.getItem('user_info');
          if (savedUserInfo) {
            try {
              const userInfo = JSON.parse(savedUserInfo);
              setUser({ id: userInfo.id, nickname: userInfo.nickname });
            } catch (error) {
              console.error('사용자 정보 파싱 오류:', error);
              setUser({ id: 'user', nickname: 'User' }); // 파싱 실패 시 기본값
            }
          } else {
            setUser({ id: 'user', nickname: 'User' }); // 사용자 정보가 없을 때 기본값
          }
          // 토큰이 있고 루트 페이지에 있다면 dashboard로 리다이렉트
          if (pathname === '/') {
            router.push('/dashboard');
          }
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, [router, pathname]);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithUUID, logout }}>
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