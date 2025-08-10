'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { University, AppliedUniversity } from '@/types';
import { getCountryFlag } from '@/utils/countryFlags';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { usersAPI, universitiesAPI } from '@/api';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function EditApplicationsClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [selectedUniversities, setSelectedUniversities] = useState<AppliedUniversity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [modifyCount, setModifyCount] = useState<number | null>(null);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // 지원 대학교 변경 페이지 접근 이벤트 추적
          const safeNickname = user?.nickname
            ?.replace(/\s+/g, '')
            ?.replace(/[^\w가-힣]/g, '') || user?.id;
          
          trackEvent('지원 대학교 변경 페이지 접근', 'applications_interaction', safeNickname);
          
          // 현재 사용자 데이터 가져오기
          const userData = await usersAPI.getUserById(user.id);
          
          // modifyCount 가져오기
          const meData = await usersAPI.getMe();
          
          setModifyCount(meData.modifyCount || 0);
          setUserData({
            editCount: 0, // TODO: API에서 제공되면 사용
            maxEditCount: 3, // TODO: API에서 제공되면 사용
            isDeadlineRestricted: false, // TODO: API에서 제공되면 사용
            appliedUniversities: userData.applications || []
          });
          
          if (userData.applications && userData.applications.length > 0) {
            // API 응답을 AppliedUniversity 형태로 변환
            const appliedUniversities = userData.applications.map((app: any) => ({
              universityId: app.universityId.toString(),
              rank: app.choice
            }));
            setSelectedUniversities(appliedUniversities);
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        }
      }
    };

    fetchUserData();
  }, [user, trackEvent]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universities = await universitiesAPI.getUniversities();
        setAllUniversities(universities);
      } catch (error) {
        console.error('대학교 목록 가져오기 오류:', error);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
  if (!loading && !user) {
    router.push('/');
  }
}, [user, loading, router]);

  const getFilteredUniversities = () => {
    if (!searchQuery) return allUniversities;
    
    return allUniversities.filter((university) =>
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleUniversitySelect = (universityId: string) => {
    const isAlreadySelected = selectedUniversities.some(u => u.universityId === universityId);
    
    if (isAlreadySelected) {
      setSelectedUniversities(selectedUniversities.filter(u => u.universityId !== universityId));
    } else {
      if (selectedUniversities.length >= 5) {
        alert('최대 5개 대학교까지만 지원할 수 있습니다.');
        return;
      }
      
      const newRank = selectedUniversities.length + 1;
      setSelectedUniversities([...selectedUniversities, { universityId, rank: newRank }]);
    }
  };

  const handleRankChange = (universityId: string, newRank: number) => {
    if (newRank < 1 || newRank > selectedUniversities.length) return;
    
    const updatedList = selectedUniversities.map(u => {
      if (u.universityId === universityId) {
        return { ...u, rank: newRank };
      } else if (u.rank === newRank) {
        const oldRank = selectedUniversities.find(x => x.universityId === universityId)?.rank || 0;
        return { ...u, rank: oldRank };
      }
      return u;
    });
    
    setSelectedUniversities(updatedList);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const safeNickname = user?.nickname
            ?.replace(/\s+/g, '')
            ?.replace(/[^\w가-힣]/g, '') || user?.id;
      // 지원 대학교 변경 시도 이벤트 추적
      trackEvent('지원_대학교_변경_시도', 'form', safeNickname);
      
      const applicationsData = selectedUniversities.map(u => ({
        universityId: parseInt(u.universityId),
        choice: u.rank
      }));
      
      await usersAPI.updateApplications(applicationsData);
      
      setMessage({ type: 'success', text: '지원 대학교가 성공적으로 변경되었습니다.' });
      
      // 3초 후 프로필 페이지로 이동
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 1500);
    } catch (error) {
      console.error('지원 대학교 변경 오류:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '오류가 발생했습니다. 다시 시도해주세요.' 
      });
      
    } finally {
      setIsSubmitting(false);
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
    router.push('/');
    return null;
  }

  const selectedUniversityData = selectedUniversities.map(selected => ({
    ...selected,
    university: allUniversities.find(u => u.id === selected.universityId)
  })).filter(item => item.university).sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title="지원 대학교 변경"
        showBackButton={true}
        showHomeButton={true}
        backUrl={`/profile/${user.id}`}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 현재 상태 표시 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-blue-600 text-xl mr-2">ℹ️</div>
            <div>
              <h3 className="text-blue-800 font-semibold">변경 가능 횟수</h3>
              <p className="text-blue-700 text-sm">
                총 {modifyCount !== null ? 3 - modifyCount : '?'}회 남음
                {modifyCount !== null && modifyCount >= 3 && " (변경 불가)"}
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="text-xl mr-2">
                {message.type === 'success' ? '✅' : '❌'}
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        )}

        {/* 현재 선택된 대학교 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            선택된 대학교 ({selectedUniversities.length}/5)
          </h2>
          {selectedUniversityData.length > 0 ? (
            <div className="space-y-3">
              {selectedUniversityData.map(({ university, rank, universityId }) => (
                <div key={universityId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg text-blue-600">{rank}순위</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCountryFlag(university!.country)}</span>
                      <span className="font-medium">{university!.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select 
                      value={rank}
                      onChange={(e) => handleRankChange(universityId, parseInt(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Array.from({ length: selectedUniversities.length }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}순위</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleUniversitySelect(universityId)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 text-sm border border-red-300 rounded hover:bg-red-50"
                    >
                      제거
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              아직 선택된 대학교가 없습니다. 아래에서 대학교를 선택해주세요.
            </p>
          )}
        </div>

        {/* 대학교 검색 및 선택 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            대학교 선택
          </h2>
          
          {/* 검색 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="대학교 이름 또는 국가로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 대학교 목록 */}
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getFilteredUniversities().map((university) => {
                const isSelected = selectedUniversities.some(u => u.universityId === university.id);
                const selectedRank = selectedUniversities.find(u => u.universityId === university.id)?.rank;
                
                return (
                  <button
                    key={university.id}
                    onClick={() => handleUniversitySelect(university.id)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCountryFlag(university.country)}</span>
                        <div>
                          <div className="font-medium">{university.name}</div>
                          <div className="text-sm text-gray-600">{university.country}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-blue-600 font-semibold text-sm">
                          {selectedRank}순위
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push(`/profile/${user.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedUniversities.length === 0 || (modifyCount !== null && modifyCount >= 3)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '변경 중...' : '변경 완료'}
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}