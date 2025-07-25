'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockUniversities } from '@/data/mockData';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState(mockUniversities[0]);

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

  const getVerificationButtonText = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return '성적 인증 완료';
      case 'pending':
        return '인증 진행 중';
      default:
        return '성적 인증하기';
    }
  };

  const getVerificationButtonClass = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return 'bg-green-600 hover:bg-green-700';
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              건대 합격 예상 정리본
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                {user.name}님 ({user.role === 'admin' ? '관리자' : '사용자'})
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {user.name}
              </span>
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-purple-700 cursor-pointer"
                >
                  관리자
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* 왼쪽: 공지사항 및 인증 버튼 */}
          <div className="lg:col-span-1">
            {/* 공지사항 */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📢 공지사항
              </h2>
              <div className="space-y-3">
                {selectedUniversity.notices.map((notice) => (
                  <div key={notice.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-gray-900">{notice.title}</p>
                    <p className="text-sm text-gray-600">{notice.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                    {notice.url && (
                      <p className="text-xs text-blue-600 mt-1">{notice.url}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 성적 인증 버튼 */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                성적 인증
              </h3>
              <button
                onClick={() => {
                  if (user.verificationStatus === 'not_verified') {
                    router.push('/verification');
                  } else if (user.verificationStatus === 'pending') {
                    router.push('/verification/status');
                  } else {
                    router.push('/verification/edit');
                  }
                }}
                className={`w-full text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${getVerificationButtonClass()}`}
              >
                {getVerificationButtonText()}
              </button>
              
              {user.verificationStatus === 'verified' && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>✅ 인증이 완료되었습니다</p>
                  <p>• 학점: {user.gpa}</p>
                  <p>• 어학 성적: {user.languageScores.length}개</p>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 대학교 리스트 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  대학교 합격 예상 정리본
                </h2>
              </div>
              
              {/* 모바일 카드 뷰 */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {mockUniversities.map((university) => (
                    <div
                      key={university.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/university/${university.id}`)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{university.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {university.name}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {university.country} • {university.applicantCount}명 지원
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              1학기: {university.competitionRatio.level1}명
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              2학기: {university.competitionRatio.level2}명
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 데스크톱 테이블 뷰 */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        국가
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지원자 수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        모집인원
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUniversities.map((university) => (
                      <tr
                        key={university.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/university/${university.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{university.flag}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {university.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {university.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {university.applicantCount}명
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">1학기:</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {university.competitionRatio.level1}명
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">2학기:</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {university.competitionRatio.level2}명
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 