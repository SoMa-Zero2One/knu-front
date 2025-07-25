'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          대학교 합격 예상 정리본
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          대학교 교환학생 합격 예상 정리본 및 경쟁률 확인 서비스
        </p>
        
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            테스트용 UUID 링크
          </h2>
          
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="p-2 sm:p-3 bg-blue-50 rounded border">
              <p className="font-medium text-blue-900 mb-1">일반 사용자 1 (인증 완료)</p>
              <Link 
                href="/auth/user-uuid-1" 
                className="text-blue-600 hover:underline break-all cursor-pointer"
              >
                /auth/user-uuid-1
              </Link>
            </div>
            
            <div className="p-2 sm:p-3 bg-green-50 rounded border">
              <p className="font-medium text-green-900 mb-1">일반 사용자 2 (인증 완료)</p>
              <Link 
                href="/auth/user-uuid-2" 
                className="text-green-600 hover:underline break-all cursor-pointer"
              >
                /auth/user-uuid-2
              </Link>
            </div>
            
            <div className="p-2 sm:p-3 bg-yellow-50 rounded border">
              <p className="font-medium text-yellow-900 mb-1">일반 사용자 4 (미인증)</p>
              <Link 
                href="/auth/user-uuid-4" 
                className="text-yellow-600 hover:underline break-all cursor-pointer"
              >
                /auth/user-uuid-4
              </Link>
            </div>
            
            <div className="p-2 sm:p-3 bg-purple-50 rounded border">
              <p className="font-medium text-purple-900 mb-1">관리자</p>
              <Link 
                href="/auth/admin-uuid-1" 
                className="text-purple-600 hover:underline break-all cursor-pointer"
              >
                /auth/admin-uuid-1
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
