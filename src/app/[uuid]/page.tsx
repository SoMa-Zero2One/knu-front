'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function AuthPage({ params }: AuthPageProps) {
  const router = useRouter();
  const { loginWithUUID } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const resolvedParams = await params;
        await loginWithUUID(resolvedParams.uuid);
        // AuthContext에서 자동으로 dashboard로 리다이렉트 처리됨
      } catch (error) {
        console.error('인증 오류:', error);
        setError('서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [params, loginWithUUID]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">인증 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">인증 실패</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
} 