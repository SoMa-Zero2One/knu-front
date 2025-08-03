'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, University, LanguageScore, LanguageTestType } from '@/types';
import Header from '@/components/Header';
import AppliedUniversityItem from '@/components/AppliedUniversityItem';
import BottomNavigation from '@/components/BottomNavigation';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { user: currentUser, loading } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [appliedUniversities, setAppliedUniversities] = useState<Array<University & { rank: number }>>([]);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [expandedGrades, setExpandedGrades] = useState(false);
  const [expandedUniversities, setExpandedUniversities] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // lang 문자열을 LanguageScore로 변환하는 함수
  const parseLangString = (langString: string) => {
    if (!langString) return [];
    
    // 여러 개의 어학 성적이 있을 수 있으므로 쪼표나 세미콜론으로 구분
    const scores = langString.split(/[,;]/).map(s => s.trim()).filter(s => s);
    
    return scores.map((scoreStr, index) => {
      // 테스트 종류와 점수를 분리
      const match = scoreStr.match(/(\S+)\s+(\d+)/);
      if (match) {
        const [, testName, score] = match;
        let type: LanguageTestType = 'TOEFL_IBT'; // 기본값
        
        // 테스트 이름에 따라 타입 결정
        const lowerTestName = testName.toLowerCase();
        if (lowerTestName.includes('toefl')) {
          type = 'TOEFL_IBT';
        } else if (lowerTestName.includes('토익') || lowerTestName.includes('toeic')) {
          type = 'TOEIC';
        } else if (lowerTestName.includes('ielts')) {
          type = 'IELTS';
        } else if (lowerTestName.includes('jlpt')) {
          type = 'JLPT';
        } else if (lowerTestName.includes('hsk')) {
          type = 'HSK';
        }
        
        return {
          id: `lang-${index}`,
          type,
          score
        };
      }
      return null;
    }).filter(Boolean) as LanguageScore[];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (resolvedParams?.id && currentUser) {
        try {
          // localStorage에서 accessToken 가져오기
          const token = localStorage.getItem('auth_token');
          if (!token) {
            console.error('AccessToken이 없습니다.');
            return;
          }
          
          // 사용자 정보 가져오기
          const response = await fetch(`http://3.34.47.29:8000/users/${resolvedParams.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          
          
          if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            
            const userProfile = {
              id: userData.id,
              nickname: userData.nickname,
              gpa: userData.grade, // grade를 gpa로 매핑
              languageScores: parseLangString(userData.lang), // lang 문자열 파싱
              appliedUniversities: userData.applications || []
            };
            
            setProfileUser(userProfile);
            
            // applications 데이터를 대학교 정보와 함께 설정
            // TODO: 대학교 정보를 가져오는 API 추가 필요
            setAppliedUniversities([]);
          } else {
            console.error('사용자 데이터 가져오기 실패:', response.status);
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        }
      }
    };
    
    fetchUserData();
  }, [resolvedParams, currentUser]);

  // 리디렉션 로직을 useEffect로 이동
  useEffect(() => {
    if (loading) return; // 로딩 중이면 아직 체크하지 않음

    if (!currentUser) {
      router.push('/');
      return;
    }

  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  if (!profileUser) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">사용자를 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title={`${profileUser.nickname}님의 프로필`}
        showBackButton={true}
        backButtonText="← 뒤로 가기"
        showHomeButton={true}
        hideProfileButton={currentUser?.id === profileUser.id}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 모바일: 아코디언 스타일 */}
        <div className="block lg:hidden mb-8">
          {/* 모바일: 아코디언 버튼들 */}
          <div className="space-y-4">
            {/* 성적 정보 버튼 */}
            <div className="bg-white rounded-lg shadow">
              <button
                onClick={() => setExpandedGrades(!expandedGrades)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">📊</span>
                  <span className="font-semibold text-gray-900">
                    성적 정보 ({profileUser.languageScores?.length}개 어학 성적)
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedGrades ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedGrades && (
                <div className="p-4 border-t">
                  {/* 학점 */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">학점</h4>
                    {profileUser.gpa ? (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-lg font-bold text-blue-900">
                          {profileUser.gpa.toFixed(2)} / 4.5
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">정보 없음</p>
                    )}
                  </div>

                  {/* 어학 성적 */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">어학 성적</h4>
                    {profileUser.languageScores.length > 0 ? (
                      <div className="space-y-2">
                        {profileUser.languageScores.map((score) => (
                          <div key={score.id} className="bg-green-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-green-900">
                                {score.type}
                              </span>
                              <span className="text-green-700 font-semibold">
                                {score.score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">어학 성적 없음</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 지원 대학교 목록 버튼 */}
            <div className="bg-white rounded-lg shadow">
              <button
                onClick={() => setExpandedUniversities(!expandedUniversities)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">🏫</span>
                  <span className="font-semibold text-gray-900">
                    지원 대학 목록 ({appliedUniversities.length}개)
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedUniversities ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedUniversities && (
                <div className="border-t">
                  <div className="p-4 border-b">
                    <p className="text-sm text-gray-600">
                      대학교를 클릭하면 해당 대학교의 다른 지원자들을 확인할 수 있습니다.
                    </p>
                    
                    {/* 본인 프로필인 경우에만 액션 버튼들 표시 */}
                    {currentUser && currentUser.id === profileUser.id && (
                      <div className="mt-4">
                        <button
                          onClick={() => router.push('/applications/edit')}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          지원 대학교 변경
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {appliedUniversities.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              지망순위
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              대학교
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              국가
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              총 지원자
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              모집인원
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appliedUniversities
                            .sort((a, b) => a.rank - b.rank)
                            .map((university) => (
                              <AppliedUniversityItem
                                key={university.id}
                                university={university}
                              />
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 text-6xl mb-4">🏫</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        지원한 대학교가 없습니다
                      </h3>
                      <p className="text-gray-600">
                        {profileUser.nickname}님이 아직 지원한 대학교가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 데스크톱에서는 기존 레이아웃 유지 */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 사용자 정보 */}
          <div className="lg:col-span-1">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">
                    {profileUser.nickname.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {profileUser.nickname}
                </h2>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {appliedUniversities.length}
                  </p>
                  <p className="text-sm text-gray-600">지원 대학교</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {profileUser.languageScores.length}
                  </p>
                  <p className="text-sm text-gray-600">어학 성적</p>
                </div>
              </div>

            </div>

            {/* 성적 정보 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 성적 정보
              </h3>
              
              {/* 학점 */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">학점</h4>
                {profileUser.gpa ? (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-900">
                      {profileUser.gpa.toFixed(2)} / 4.5
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">정보 없음</p>
                )}
              </div>

              {/* 어학 성적 */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">어학 성적</h4>
                {profileUser.languageScores.length > 0 ? (
                  <div className="space-y-2">
                    {profileUser.languageScores.map((score) => (
                      <div key={score.id} className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-900">
                            {score.type}
                          </span>
                          <span className="text-green-700 font-semibold">
                            {score.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">어학 성적 없음</p>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 지원 대학교 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      지원한 대학교 목록 ({appliedUniversities.length}개)
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      대학교를 클릭하면 해당 대학교의 다른 지원자들을 확인할 수 있습니다.
                    </p>
                  </div>
                  
                  {/* 본인 프로필인 경우에만 액션 버튼들 표시 */}
                  {currentUser && currentUser.id === profileUser.id && (
                    <div className="cursor-pointer mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex">
                      <button
                        onClick={() => router.push('/applications/edit')}
                        className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 hover:cursor-pointer transition-colors"
                      >
                        지원 대학교 변경
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {appliedUniversities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          지망순위
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          대학교
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          국가
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          총 지원자
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          모집인원
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appliedUniversities
                        .sort((a, b) => a.rank - b.rank)
                        .map((university) => (
                          <AppliedUniversityItem
                            key={university.id}
                            university={university}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🏫</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    지원한 대학교가 없습니다
                  </h3>
                  <p className="text-gray-600">
                    {profileUser.nickname}님이 아직 지원한 대학교가 없습니다.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 