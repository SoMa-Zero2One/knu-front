'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { University, AppliedUniversity } from '@/types';
import { getCountryFlag } from '@/utils/countryFlags';
import Header from '@/components/Header';
import { usersAPI, universitiesAPI } from '@/api';

export default function EditApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
  }, [user]);

  // 전체 대학 리스트 가져오기
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universitiesData = await universitiesAPI.getUniversities();
        setAllUniversities(universitiesData);
      } catch (error) {
        console.error('대학교 정보 가져오기 오류:', error);
      }
    };

    fetchUniversities();
  }, []);


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

  if (!userData || modifyCount === null) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 편집 제한 체크 (modifyCount 기반)
  const canEdit = modifyCount > 0;
  const remainingEdits = modifyCount;

  const handleUniversityToggle = (universityId: string) => {
    if (!canEdit) return;

    setSelectedUniversities(prev => {
      const isAlreadySelected = prev.some(app => app.universityId === universityId);
      
      if (isAlreadySelected) {
        // 선택 해제: 해당 대학교 제거 후 순위 재정렬
        const filtered = prev.filter(app => app.universityId !== universityId);
        return filtered.map((app, index) => ({ ...app, rank: index + 1 }));
      } else {
        // 5개 제한 체크 (UI에서 이미 막혀있으므로 실행되지 않을 것)
        if (prev.length >= 5) {
          return prev;
        }
        
        // 선택: 가장 뒤 순위로 추가
        const nextRank = prev.length + 1;
        return [...prev, { universityId, rank: nextRank }];
      }
    });
  };

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    // 0개 선택시 변경 불가
    if (selectedUniversities.length === 0) {
      setMessage({ type: 'error', text: '최소 1개 이상의 대학교를 선택해주세요.' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 선택된 대학교들을 API 형식에 맞게 변환 (항상 5개 보내기)
      const applicationsData = [];
      
      // 선택된 대학교들 추가
      selectedUniversities.forEach(app => {
        applicationsData.push({
          universityId: parseInt(app.universityId),
          choice: app.rank
        });
      });
      
      console.log('보낼 데이터:', { applications: applicationsData });

      await usersAPI.updateApplications({ applications: applicationsData });

      setMessage({ type: 'success', text: '지원 대학교가 성공적으로 변경되었습니다!' });
      
      // 3초 후 프로필 페이지로 이동
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 3000);
      
    } catch (error) {
      console.error('지원 대학교 업데이트 오류:', error);
      setMessage({ type: 'error', text: '변경 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = JSON.stringify(selectedUniversities.sort((a, b) => a.rank - b.rank)) !== JSON.stringify(userData.appliedUniversities.sort((a, b) => a.rank - b.rank));

  // 검색 필터링된 대학교 목록
  const filteredUniversities = allUniversities.filter(university => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      university.name.toLowerCase().includes(query) ||
      university.country.toLowerCase().includes(query)
    );
  });




  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title="지원 대학교 변경"
        showBackButton={true}
        showHomeButton
        backButtonText="← 돌아가기"
        backUrl={`/profile/${user.id}`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 안내 메시지 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 편집 안내</h2>
          
          {canEdit ? (
            <div className="space-y-2">
              <p className="text-green-700">✅ 편집 가능한 상태입니다.</p>
              <p className="text-sm text-gray-600">• 남은 편집 횟수: <span className="font-semibold">{remainingEdits}회</span></p>
              <p className="text-sm text-gray-600">• 원하는 대학교를 선택하고 저장하세요.</p>
              <p className="text-xs text-blue-600 mt-2">ℹ️ 마감 3일 전에 편집 횟수가 4회로 초기화됩니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-700">❌ 편집할 수 없습니다.</p>
              <p className="text-sm text-gray-600">• 편집 횟수를 모두 사용했습니다.</p>
              <p className="text-xs text-blue-600 mt-2">ℹ️ 마감 3일 전부터는 편집 횟수가 제한됩니다.</p>
            </div>
          )}
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 선택된 대학교 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  나의 지원 목록 ({selectedUniversities.length}/5개)
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  선택한 순서대로 순위가 정해집니다. 최대 5개까지 선택 가능합니다.
                </p>
              </div>
              
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedUniversities.length > 0 ? (
                  selectedUniversities
                    .sort((a, b) => a.rank - b.rank)
                    .map((app) => {
                      const university = allUniversities.find(u => u.id.toString() === app.universityId);
                      if (!university) return null;
                      
                      return (
                        <div
                          key={app.universityId}
                          className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
                              app.rank === 1 ? 'bg-yellow-500' :
                              app.rank === 2 ? 'bg-gray-400' :
                              app.rank === 3 ? 'bg-amber-600' :
                              'bg-blue-500'
                            }`}>
                              {app.rank}
                            </span>
                            <span className="text-2xl">{getCountryFlag(university.country)}</span>
                            <div>
                              <div className="font-medium text-gray-800">{university.name}</div>
                              <div className="text-xs text-gray-500">{university.country}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">선택된 대학교가 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-1">오른쪽 목록에서 대학교를 선택해주세요.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우측: 대학교 선택 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 pt-6 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      지원 가능 대학교
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      지원할 대학교를 선택하세요.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 대학교 검색창 */}
              <div className="px-6 pb-4 border-b">
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
              
              <div className="p-6">
                <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {filteredUniversities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUniversities.map((university) => {
                    const selectedApp = selectedUniversities.find(app => app.universityId === university.id.toString());
                    const isSelected = !!selectedApp;
                    const isMaxReached = selectedUniversities.length >= 5 && !isSelected;
                    
                    return (
                      <div
                        key={university.id}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                            : isMaxReached
                            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'  
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (canEdit && !isMaxReached) {
                            handleUniversityToggle(university.id.toString());
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">{getCountryFlag(university.country)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <h3 className="text-base font-medium text-gray-900 truncate">{university.name}</h3>
                              </div>
                              {isSelected && selectedApp && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0">{selectedApp.rank}순위</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 mb-2 truncate">{university.country}</p>
                            <div className="text-xs text-gray-500">
                              <p>지원자: {university.applicantCount}명</p>
                              <p>모집인원: {university.slot}명</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
                      <p className="text-sm text-gray-400 mt-1">
                        다른 검색어를 입력해보세요
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 pt-6 border-t flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!canEdit || !hasChanges || isSubmitting || selectedUniversities.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              canEdit && hasChanges && !isSubmitting && selectedUniversities.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장 중...
              </>
            ) : (
              '변경 저장'
            )}
          </button>
        </div>
      </main>

    </div>
  );
} 