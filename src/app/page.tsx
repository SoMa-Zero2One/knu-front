'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          대학교 합격 예상 정리본
        </h1>
        <p className="text-sm sm:text-base text-black mb-6 sm:mb-8">
          대학교 교환학생 합격 예상 정리본 및 경쟁률 확인
        </p>
        <p className="text-xs sm:text-base text-black mb-6 sm:mb-8">
          보내드린 링크로 접속하셔야 사용자 인증이 가능합니다.
        </p>
      </div>
    </div>
  );
}
