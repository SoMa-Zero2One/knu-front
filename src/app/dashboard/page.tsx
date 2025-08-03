'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import UniversityItem from '@/components/UniversityItem';
import BottomNavigation from '@/components/BottomNavigation';
import { User, University } from '@/types';
import { universitiesAPI } from '@/api';

export default function DashboardPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 백엔드에서 학교 정보 가져오기
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universitiesData = await universitiesAPI.getUniversities();
        setUniversities(universitiesData);
      } catch (error) {
        console.error('학교 정보 가져오기 오류:', error);
      }
    };

    if (token) {
      fetchUniversities();
    }
  }, [token]);

    useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // 검색 필터링 및 정렬된 대학교 목록 (국가순 → 대학 이름순)
  const filteredUniversities = universities
    .filter(university => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        university.name.toLowerCase().includes(query) ||
        university.country.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // 먼저 국가순으로 정렬
      const countryComparison = a.country.localeCompare(b.country);
      if (countryComparison !== 0) {
        return countryComparison;
      }
      // 같은 국가 내에서는 대학 이름순으로 정렬
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title="경북대학교 합격 예상 정리본"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-6 lg:pb-8">

        {/* 검색창 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="대학교 이름 또는 국가로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                "{searchQuery}" 검색 결과: {filteredUniversities.length}개 대학교
              </p>
            )}
          </div>
        </div>

        {/* 대학교 리스트 */}
        <div>
          {filteredUniversities.length > 0 ? (
            <div className="bg-white rounded-md shadow">
              {/* 모바일 카드 뷰 */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredUniversities.map((university) => (
                    <UniversityItem key={university.id} university={university} isMobile />
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
                  <tbody className="bg-white">
                    {filteredUniversities.map((university) => (
                      <UniversityItem key={university.id} university={university} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-10">
              <div className="text-center">
                <div className="text-gray-400 mb-3">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">
                  다른 검색어를 입력해보세요
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 