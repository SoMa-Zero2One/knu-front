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

  const handleGoogleFormClick = () => {
    window.open('https://forms.gle/9G3VpcMX46A927Ph8', '_blank');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            🎓 교환학생 경쟁률 정리본
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            대학교 교환학생 경쟁률 및 합격 예상 확인
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div>
                <h3 className="font-semibold text-gray-900 mb-2">구글폼을 이미 제출하셨나요?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  💌 이메일로 받으신 개인 링크를 이용해<br />
                  접속해주세요
                </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">처음이신가요?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  💡 구글폼 작성 후 개인 링크를 이메일로<br />
                  발송해드립니다
                </p>
                <button
                  onClick={handleGoogleFormClick}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
                >
                  구글폼 작성하러 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
