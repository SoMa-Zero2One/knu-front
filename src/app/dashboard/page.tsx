'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockUniversities, getUserById } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);

  // 값별로 랜덤 색상을 할당하는 함수
  const getColorForValue = (value: string): string => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800', 
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-gray-100 text-gray-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800',
      'bg-lime-100 text-lime-800',
      'bg-emerald-100 text-emerald-800',
      'bg-sky-100 text-sky-800',
      'bg-violet-100 text-violet-800',
      'bg-fuchsia-100 text-fuchsia-800',
      'bg-rose-100 text-rose-800',
      'bg-amber-100 text-amber-800',
      'bg-slate-100 text-slate-800',
      'bg-zinc-100 text-zinc-800',
      'bg-neutral-100 text-neutral-800',
      'bg-stone-100 text-stone-800',
      'bg-red-200 text-red-900',
      'bg-blue-200 text-blue-900',
      'bg-green-200 text-green-900',
      'bg-purple-200 text-purple-900',
      'bg-pink-200 text-pink-900',
      'bg-indigo-200 text-indigo-900',
      'bg-orange-200 text-orange-900',
      'bg-teal-200 text-teal-900'
    ];
    
    // 문자열을 해시하여 일관성 있는 색상 선택
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit 정수로 변환
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (user) {
      const fullUserData = getUserById(user.id);
      setUserData(fullUserData);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }



  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title="경북대학교 합격 예상 정리본"
        leftContent={
          <div className="flex items-center space-x-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              경북대학교 합격 예상 정리본
            </h1>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* 대학교 리스트 */}
        <div>
            <div className="bg-white rounded-md shadow">
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
                          <div className="text-xs mb-2 flex flex-wrap gap-1 items-center">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.country)}`}>
                              {university.country}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.applicantCount.toString())}`}>
                              {university.applicantCount}명 지원
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.duration || '기간 미정')}`}>
                              {university.duration || '기간 미정'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                              1학기: {university.competitionRatio.level1}명
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
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
                        파견 기간
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.country)}`}>
                            {university.country}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.applicantCount.toString())}`}>
                            {university.applicantCount}명
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(university.duration || '-')}`}>
                            {university.duration || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">1학기:</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                                {university.competitionRatio.level1}명
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">2학기:</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
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