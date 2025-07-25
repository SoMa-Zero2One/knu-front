'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockUniversities, getUserById } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { University, AppliedUniversity } from '@/types';

export default function EditApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<AppliedUniversity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [customUniversities, setCustomUniversities] = useState<University[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [selectedUniversityToAdd, setSelectedUniversityToAdd] = useState<University | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = getUserById(user.id);
      if (userData) {
        setSelectedUniversities([...userData.appliedUniversities]);
      }
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

  const userData = getUserById(user.id);
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 편집 제한 체크
  const canEdit = userData.editCount < userData.maxEditCount && !userData.isDeadlineRestricted;
  const remainingEdits = userData.maxEditCount - userData.editCount;

  const handleUniversityToggle = (universityId: string) => {
    if (!canEdit) return;

    setSelectedUniversities(prev => {
      const isAlreadySelected = prev.some(app => app.universityId === universityId);
      
      if (isAlreadySelected) {
        // 선택 해제: 해당 대학교 제거 후 순위 재정렬
        const filtered = prev.filter(app => app.universityId !== universityId);
        return filtered.map((app, index) => ({ ...app, rank: index + 1 }));
      } else {
        // 선택: 가장 뒤 순위로 추가
        const nextRank = prev.length + 1;
        return [...prev, { universityId, rank: nextRank }];
      }
    });
  };

  const handleRankChange = (universityId: string, newRank: number) => {
    if (!canEdit) return;

    setSelectedUniversities(prev => {
      const maxRank = prev.length;
      const clampedRank = Math.max(1, Math.min(newRank, maxRank));
      
      const updatedList = prev.map(app => {
        if (app.universityId === universityId) {
          return { ...app, rank: clampedRank };
        }
        return app;
      });

      // 순위 중복 해결 및 정렬
      const sortedList = updatedList.sort((a, b) => a.rank - b.rank);
      return sortedList.map((app, index) => ({ ...app, rank: index + 1 }));
    });
  };

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    
    try {
      // 실제 구현에서는 API 호출
      // 여기서는 mock 데이터 업데이트 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock 데이터 업데이트 (실제로는 API 호출)
      userData.appliedUniversities = [...selectedUniversities];
      userData.editCount += 1;
      
      setMessage({ type: 'success', text: '지원 대학교가 성공적으로 변경되었습니다!' });
      
      // 3초 후 프로필 페이지로 이동
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: '변경 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = JSON.stringify(selectedUniversities.sort((a, b) => a.rank - b.rank)) !== JSON.stringify(userData.appliedUniversities.sort((a, b) => a.rank - b.rank));

  // 전체 대학교 목록 (기존 + 사용자 추가)
  const allUniversities = [...mockUniversities, ...customUniversities];

  // Mock API - 대학교 검색 (실제로는 백엔드 API 호출)
  const searchUniversities = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // 실제 구현에서는 백엔드 API 호출
    await new Promise(resolve => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션
    
    // Mock 검색 결과 (실제로는 API 응답)
    const mockSearchResults: University[] = [
      {
        id: `search-1-${Date.now()}`,
        name: 'Stanford University',
        country: '미국',
        flag: '🇺🇸',
        competitionRatio: { level1: 5, level2: 3 },
        notices: [],
        applicantCount: 0
      },
      {
        id: `search-2-${Date.now()}`,
        name: 'University of Cambridge',
        country: '영국',
        flag: '🇬🇧',
        competitionRatio: { level1: 4, level2: 2 },
        notices: [],
        applicantCount: 0
      },
      {
        id: `search-3-${Date.now()}`,
        name: 'Seoul National University',
        country: '대한민국',
        flag: '🇰🇷',
        competitionRatio: { level1: 10, level2: 5 },
        notices: [],
        applicantCount: 0
      },
    ].filter(uni => 
      uni.name.toLowerCase().includes(query.toLowerCase()) ||
      uni.country.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockSearchResults);
    setIsSearching(false);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedUniversityToAdd(null);
    searchUniversities(query);
  };

  // 검색 결과에서 대학교 선택
  const handleSelectSearchResult = (university: University) => {
    setSelectedUniversityToAdd(university);
    setSearchResults([]);
    setSearchQuery('');
  };

  // 확인 후 대학교 추가
  const handleConfirmAddUniversity = () => {
    if (!selectedUniversityToAdd) return;

    const customId = `custom-${Date.now()}`;
    const university: University = {
      ...selectedUniversityToAdd,
      id: customId
    };

    setCustomUniversities(prev => [...prev, university]);
    setSelectedUniversityToAdd(null);
    setShowAddForm(false);
    setMessage({ type: 'success', text: `${university.name}이(가) 추가되었습니다!` });
    
    // 추가된 대학교를 자동으로 선택 (가장 뒤 순위로)
    setSelectedUniversities(prev => {
      const nextRank = prev.length + 1;
      return [...prev, { universityId: customId, rank: nextRank }];
    });
  };

  // 추가 폼 취소
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUniversityToAdd(null);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 뒤로가기
              </button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                지원 대학교 변경
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {user.name}님
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 안내 메시지 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 편집 안내</h2>
          
          {canEdit ? (
            <div className="space-y-2">
              <p className="text-green-700">✅ 편집 가능한 상태입니다.</p>
              <p className="text-sm text-gray-600">• 남은 편집 횟수: <span className="font-semibold">{remainingEdits}회</span></p>
              <p className="text-sm text-gray-600">• 원하는 대학교를 선택하고 저장하세요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-700">❌ 편집할 수 없습니다.</p>
              {userData.editCount >= userData.maxEditCount && (
                <p className="text-sm text-gray-600">• 편집 횟수를 모두 사용했습니다.</p>
              )}
              {userData.isDeadlineRestricted && (
                <p className="text-sm text-gray-600">• 마감일이 임박하여 편집이 제한됩니다.</p>
              )}
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

                 {/* 대학교 선택 */}
         <div className="bg-white rounded-lg shadow">
           <div className="p-6 border-b">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
               <div>
                 <h2 className="text-xl font-semibold text-gray-900">
                   지원 대학교 선택 ({selectedUniversities.length}개)
                 </h2>
                 <p className="text-sm text-gray-600 mt-1">
                   지원하고 싶은 대학교를 선택하세요. 목록에 없는 대학교는 직접 추가할 수 있습니다.
                 </p>
               </div>
               
               <div className="mt-4 sm:mt-0">
                 <button
                   onClick={() => setShowAddForm(true)}
                   disabled={!canEdit}
                   className={`inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium transition-colors ${
                     canEdit 
                       ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                       : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                   }`}
                 >
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                   새 대학교 추가
                 </button>
               </div>
             </div>
           </div>
          
                     <div className="p-6">
             {/* 새 대학교 추가 폼 */}
             {showAddForm && (
               <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">새 대학교 검색 및 추가</h3>
                 
                 {/* 검색 입력 */}
                 <div className="relative">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     대학교 이름으로 검색
                   </label>
                   <div className="relative">
                     <input
                       type="text"
                       value={searchQuery}
                       onChange={(e) => handleSearchChange(e.target.value)}
                       className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                       placeholder="예: Stanford University, Cambridge, 서울대학교..."
                     />
                     {isSearching && (
                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                         <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                       </div>
                     )}
                   </div>
                   
                   {/* 검색 결과 드롭다운 */}
                   {searchResults.length > 0 && (
                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                       {searchResults.map((university) => (
                         <button
                           key={university.id}
                           onClick={() => handleSelectSearchResult(university)}
                           className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                         >
                           <div className="flex items-center space-x-3">
                             <span className="text-2xl">{university.flag}</span>
                             <div>
                               <div className="font-medium text-gray-900">{university.name}</div>
                               <div className="text-sm text-gray-500">{university.country}</div>
                             </div>
                           </div>
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                 {/* 선택된 대학교 확인 카드 */}
                 {selectedUniversityToAdd && (
                   <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                     <h4 className="text-md font-medium text-gray-900 mb-3">추가할 대학교 정보를 확인해주세요</h4>
                     <div className="flex items-start space-x-4">
                       <span className="text-4xl">{selectedUniversityToAdd.flag}</span>
                       <div className="flex-1">
                         <h5 className="text-lg font-semibold text-gray-900">{selectedUniversityToAdd.name}</h5>
                         <p className="text-gray-600 mb-2">{selectedUniversityToAdd.country}</p>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                             <span className="text-gray-500">모집인원 (1학기):</span>
                             <span className="ml-2 font-medium">{selectedUniversityToAdd.competitionRatio.level1}명</span>
                           </div>
                           <div>
                             <span className="text-gray-500">모집인원 (2학기):</span>
                             <span className="ml-2 font-medium">{selectedUniversityToAdd.competitionRatio.level2}명</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* 버튼 영역 */}
                 <div className="flex justify-end space-x-3 mt-4">
                   <button
                     onClick={handleCancelAdd}
                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                   >
                     취소
                   </button>
                   {selectedUniversityToAdd && (
                     <button
                       onClick={handleConfirmAddUniversity}
                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                     >
                       이 대학교 추가하기
                     </button>
                   )}
                 </div>
               </div>
             )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {allUniversities.map((university) => {
                 const selectedApp = selectedUniversities.find(app => app.universityId === university.id);
                 const isSelected = !!selectedApp;
                
                                 const isCustom = university.id.startsWith('custom-');
                 
                 return (
                   <div
                     key={university.id}
                     className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                       isSelected 
                         ? 'border-blue-500 bg-blue-50' 
                         : 'border-gray-200 hover:border-gray-300'
                     } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''} ${
                       isCustom ? 'border-green-300 bg-green-25' : ''
                     }`}
                     onClick={() => handleUniversityToggle(university.id)}
                   >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-3xl">{university.flag}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                                                 <div className="flex items-center justify-between">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                               <h3 className="text-lg font-medium text-gray-900 truncate">
                                 {university.name}
                               </h3>
                               {isCustom && (
                                 <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                   직접 추가
                                 </span>
                               )}
                             </div>
                             
                             {/* 지망순위 표시 및 수정 */}
                             {isSelected && selectedApp && (
                               <div className="flex items-center space-x-2">
                                 <span className="text-sm text-gray-600">순위:</span>
                                 <select
                                   value={selectedApp.rank}
                                   onChange={(e) => handleRankChange(university.id, parseInt(e.target.value))}
                                   onClick={(e) => e.stopPropagation()}
                                   className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 >
                                   {Array.from({ length: selectedUniversities.length }, (_, i) => (
                                     <option key={i + 1} value={i + 1}>
                                       {i + 1}
                                     </option>
                                   ))}
                                 </select>
                               </div>
                             )}
                           </div>
                           {isSelected && (
                             <div className="flex-shrink-0 ml-2">
                               <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                 <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                 </svg>
                               </div>
                             </div>
                           )}
                         </div>
                         <p className="text-sm text-gray-600 mb-2">{university.country}</p>
                         <div className="text-sm text-gray-500">
                           <p>지원자: {university.applicantCount}명</p>
                           <p>모집인원: {university.competitionRatio.level1 + university.competitionRatio.level2}명</p>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!canEdit || !hasChanges || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              canEdit && hasChanges && !isSubmitting
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

        {/* 현재 선택된 대학교 요약 */}
        {selectedUniversities.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              선택된 대학교 ({selectedUniversities.length}개)
            </h3>
                                      <div className="space-y-2">
               {selectedUniversities
                 .sort((a, b) => a.rank - b.rank)
                 .map(app => {
                   const university = allUniversities.find(u => u.id === app.universityId);
                   if (!university) return null;
                   
                   return (
                     <div
                       key={app.universityId}
                       className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                     >
                       <div className="flex items-center space-x-3">
                         <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                           {app.rank}
                         </span>
                         <span className="text-2xl">{university.flag}</span>
                         <span className="font-medium text-gray-900">{university.name}</span>
                         <span className="text-sm text-gray-600">({university.country})</span>
                       </div>
                     </div>
                   );
                 })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 