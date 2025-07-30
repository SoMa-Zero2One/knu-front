'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockUniversities, getUserById } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fullUserData = getUserById(user.id);
      setUserData(fullUserData);
    }
  }, [user]);

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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              대학교 합격 예상 정리본
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push(`/profile/${user.id}`)}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer hidden sm:block"
              >
                {user.name}님 프로필
              </button>
              <button
                onClick={() => router.push(`/profile/${user.id}`)}
                className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer sm:hidden"
              >
                {user.name}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 인증하지 않은 유저를 위한 안내 메시지 */}
        {user.verificationStatus === 'not_verified' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-blue-800 font-medium">
                  성적 인증하고 다른 사람 성적 확인하기: 
                  <button
                    onClick={() => router.push('/verification')}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    성적 인증하러 가기
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 대학교 리스트 */}
        <div>
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
  );
} 