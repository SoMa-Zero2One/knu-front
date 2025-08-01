'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockUniversities, getUserById } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import UniversityItem from '@/components/UniversityItem';
import BottomNavigation from '@/components/BottomNavigation';

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
                  {mockUniversities.map((university) => (
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
                        파견 기간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        모집인원
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {mockUniversities.map((university) => (
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