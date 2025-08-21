'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import UniversityItem from '@/components/UniversityItem';
import BottomNavigation from '@/components/BottomNavigation';
import { User, University } from '@/types';
import { universitiesAPI, usersAPI } from '@/api';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const { user, loading, token } = useAuth();
  const { trackEvent } = useAnalytics();
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'applied' | 'hasApplicants'>('applied');
  const [userAppliedUniversities, setUserAppliedUniversities] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'applicantCount' | 'slot'>('country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
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

  // 사용자의 지원 대학교 정보 가져오기
  useEffect(() => {
    const fetchUserApplications = async () => {
      if (user) {
        try {
          const userData = await usersAPI.getUserById(user.id);
          if (userData.applications) {
            const appliedIds = new Set(userData.applications.map((app: any) => parseInt(app.universityId)));
            setUserAppliedUniversities(appliedIds);
          }
        } catch (error) {
          console.error('사용자 지원 정보 가져오기 오류:', error);
        }
      }
    };

    fetchUserApplications();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // 정렬 핸들러
  const handleSort = (column: 'name' | 'country' | 'applicantCount' | 'slot') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // 검색 및 필터링, 정렬된 대학교 목록
  const filteredUniversities = universities
    .filter(university => {
      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          university.name.toLowerCase().includes(query) ||
          university.country.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }
      
      // 타입별 필터
      switch (filterType) {
        case 'applied':
          return userAppliedUniversities.has(university.id);
        case 'hasApplicants':
          return university.applicantCount > 0;
        case 'all':
        default:
          return true;
      }
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          if (comparison === 0) {
            // 같은 국가 내에서는 대학 이름순으로 정렬
            comparison = a.name.localeCompare(b.name);
          }
          break;
        case 'applicantCount':
          comparison = a.applicantCount - b.applicantCount;
          break;
        case 'slot':
          comparison = a.slot - b.slot;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // 정렬 아이콘 컴포넌트
  const SortIcon = ({ column, currentSort, direction }: { 
    column: string; 
    currentSort: string; 
    direction: 'asc' | 'desc' 
  }) => {
    if (currentSort !== column) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    if (direction === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

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
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
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

        {/* 필터링 버튼 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => {
                  trackEvent('지망한 대학만', 'dashboard_filter', user?.nickname || 'unknown');
                  setFilterType('applied');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filterType === 'applied'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지망한 대학만 ({userAppliedUniversities.size})
              </button>
              <button
                onClick={() => {
                  trackEvent('지원자가 있는 대학만', 'dashboard_filter', user?.nickname || 'unknown');
                  setFilterType('hasApplicants');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filterType === 'hasApplicants'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지원자가 있는 대학만 ({universities.filter(u => u.applicantCount > 0).length})
              </button>
              <button
                onClick={() => {
                  trackEvent('모든 대학', 'dashboard_filter', user?.nickname || 'unknown');
                  setFilterType('all');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                모든 대학 ({universities.length})
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 전용 정렬 버튼 */}
        <div className="mb-6 sm:hidden">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700">정렬 순서</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  trackEvent('국가순 정렬', 'dashboard_sort', user?.nickname || 'unknown');
                  handleSort('country');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === 'country'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                국가순
                {sortBy === 'country' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  trackEvent('이름순 정렬', 'dashboard_sort', user?.nickname || 'unknown');
                  handleSort('name');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === 'name'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                이름순
                {sortBy === 'name' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  trackEvent('지원자수순 정렬', 'dashboard_sort', user?.nickname || 'unknown');
                  handleSort('applicantCount');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === 'applicantCount'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지원자수
                {sortBy === 'applicantCount' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  trackEvent('모집인원순 정렬', 'dashboard_sort', user?.nickname || 'unknown');
                  handleSort('slot');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === 'slot'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                모집인원
                {sortBy === 'slot' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
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
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => {
                          trackEvent('이름순 정렬', 'dashboard_table_sort', user?.nickname || 'unknown');
                          handleSort('name');
                        }}
                      >
                        <div className="flex items-center">
                          이름
                          <SortIcon column="name" currentSort={sortBy} direction={sortDirection} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => {
                          trackEvent('국가순 정렬', 'dashboard_table_sort', user?.nickname || 'unknown');
                          handleSort('country');
                        }}
                      >
                        <div className="flex items-center">
                          국가
                          <SortIcon column="country" currentSort={sortBy} direction={sortDirection} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => {
                          trackEvent('지원자수순 정렬', 'dashboard_table_sort', user?.nickname || 'unknown');
                          handleSort('applicantCount');
                        }}
                      >
                        <div className="flex items-center">
                          지원자 수
                          <SortIcon column="applicantCount" currentSort={sortBy} direction={sortDirection} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => {
                          trackEvent('모집인원순 정렬', 'dashboard_table_sort', user?.nickname || 'unknown');
                          handleSort('slot');
                        }}
                      >
                        <div className="flex items-center">
                          모집인원
                          <SortIcon column="slot" currentSort={sortBy} direction={sortDirection} />
                        </div>
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