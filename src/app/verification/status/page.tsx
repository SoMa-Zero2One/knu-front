'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function VerificationStatusPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ← 돌아가기
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                인증 상태
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name}님
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* 상태 헤더 */}
          <div className="p-8 text-center border-b">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">⏳</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              인증 진행 중
            </h2>
            <p className="text-gray-600">
              제출해주신 성적 정보를 관리자가 검토하고 있습니다.
            </p>
          </div>

          {/* 진행 상황 */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 진행 상황
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">서류 제출 완료</p>
                    <p className="text-sm text-gray-500">성적 정보가 성공적으로 제출되었습니다.</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">관리자 검토 중</p>
                    <p className="text-sm text-gray-500">관리자가 제출된 서류를 검토하고 있습니다.</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-500 text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">인증 완료</p>
                    <p className="text-sm text-gray-500">검토 완료 후 인증이 승인됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 제출된 정보 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📄 제출된 정보
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">학점 정보</h4>
                    <p className="text-sm text-gray-600">
                      평점: {user.gpa ? `${user.gpa.toFixed(2)}/4.5` : '제출됨'}
                    </p>
                    <p className="text-sm text-gray-600">
                      성적표: 제출됨 ✅
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">어학 성적</h4>
                    {user.languageScores && user.languageScores.length > 0 ? (
                      <div className="space-y-1">
                        {user.languageScores.map((score) => (
                          <p key={score.id} className="text-sm text-gray-600">
                            {score.type}: {score.score} ✅
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">제출됨 ✅</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 예상 소요 시간 */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="text-blue-500 text-xl mr-3">ℹ️</div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">예상 소요 시간</h4>
                  <p className="text-sm text-blue-700">
                    일반적으로 관리자 검토는 1-2일 정도 소요됩니다.<br/>
                    검토 완료 시 이메일로 알림을 보내드리겠습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                대시보드로 돌아가기
              </button>
              
              {user.verificationStatus === 'pending' && (
                <button
                  onClick={() => {
                    // Mock: 실제로는 API로 취소 요청
                    if (confirm('인증 신청을 취소하고 다시 제출하시겠습니까?')) {
                      router.push('/verification');
                    }
                  }}
                  className="flex-1 border border-yellow-500 text-yellow-700 px-6 py-3 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer"
                >
                  수정하기
                </button>
              )}
              
              <button
                onClick={() => {
                  alert('문의사항이 있으시면 admin@university.ac.kr로 연락주세요.');
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 