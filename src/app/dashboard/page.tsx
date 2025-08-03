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

        {/* 대학교 리스트 */}
        <div>
            <div className="bg-white rounded-md shadow">
              {/* 모바일 카드 뷰 */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {universities.map((university) => (
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
                    {universities.map((university) => (
                      <UniversityItem key={university.id} university={university} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 