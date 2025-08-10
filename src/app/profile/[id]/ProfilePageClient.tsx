'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, University } from '@/types';
import Header from '@/components/Header';
import UniversityItem from '@/components/UniversityItem';
import BottomNavigation from '@/components/BottomNavigation';
import LanguageScoreCard from '@/components/LanguageScoreCard';
import { usersAPI } from '@/api';
import { useAnalytics } from '@/hooks/useAnalytics';
import { parseLangString } from '@/utils/languageParser';

interface ProfilePageClientProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePageClient({ params }: ProfilePageClientProps) {
  const router = useRouter();
  const { user: currentUser, loading, logout } = useAuth();
  const { trackEvent } = useAnalytics();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [appliedUniversities, setAppliedUniversities] = useState<Array<University & { rank: number }>>([]);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [expandedGrades, setExpandedGrades] = useState(false);
  const [expandedUniversities, setExpandedUniversities] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (resolvedParams?.id && currentUser) {
        setProfileLoading(true);
        try {
          // 사용자 정보 가져오기
          const userData = await usersAPI.getUserById(resolvedParams.id);
          
          const userProfile = {
            id: userData.id,
            nickname: userData.nickname,
            gpa: userData.grade, // grade를 gpa로 매핑
            languageScores: parseLangString(userData.lang), // lang 문자열 파싱
            appliedUniversities: userData.applications,
          };
          
          setProfileUser(userProfile);
          
          // 다른 사용자의 프로필을 조회하는 경우 GA 이벤트 전송
          if (currentUser && currentUser.id !== userData.id) {
            const safeNickname = currentUser?.nickname
              ?.replace(/\s+/g, '')
              ?.replace(/[^\w가-힣]/g, '') || currentUser?.id;
            
            const labelWithUser = `${userData.nickname} 프로필 조회`;
            
            trackEvent(labelWithUser, 'profile_interaction', safeNickname);
          }
          
          // applications 데이터를 대학교 정보와 함께 설정
          if (userData.applications && userData.applications.length > 0) {
            // applications 배열의 각 항목을 University & { rank: number } 형태로 변환
            const universitiesWithRank = userData.applications.map((app: any, index: number) => ({
              id: app.universityId,
              name: app.universityName,
              country: app.country,
              slot: app.slot,
              applicantCount: app.totalApplicants,
              rank: app.choice || app.rank || (index + 1) // choice를 rank로 사용
            }));
            setAppliedUniversities(universitiesWithRank);
          } else {
            setAppliedUniversities([]);
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        } finally {
          setProfileLoading(false);
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

  if (loading || profileLoading) {
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
                    성적 정보 ({profileUser.languageScores?.length || 0}개 어학 성적)
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
                    {profileUser.languageScores && profileUser.languageScores.length > 0 ? (
                      <div className="space-y-2">
                        {profileUser.languageScores.map((score) => (
                          <LanguageScoreCard key={score.id} score={score} />
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
                          onClick={() => {
                            router.push('/applications/edit');
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          지원 대학교 변경
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {appliedUniversities.length > 0 ? (
                    <>
                      {/* 모바일 버전: 카드 형태 */}
                      <div className="sm:hidden space-y-2">
                        {appliedUniversities
                          .sort((a, b) => a.rank - b.rank)
                          .map((university) => (
                            <UniversityItem
                              key={university.id}
                              university={university}
                              showRank={true}
                              isMobile={true}
                            />
                          ))}
                      </div>
                      
                      {/* 데스크톱 버전: 테이블 형태 */}
                      <div className="hidden sm:block overflow-x-auto">
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
                                <UniversityItem
                                  key={university.id}
                                  university={university}
                                  showRank={true}
                                  isMobile={false}
                                />
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
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
                    {profileUser.languageScores?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">어학 성적</p>
                </div>
              </div>

              {/* 본인 프로필인 경우에만 로그아웃 버튼 표시 (데스크톱만) */}
              {currentUser && currentUser.id === profileUser.id && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      if (confirm('로그아웃 하시겠습니까?')) {
                        logout();
                        router.push('/');
                      }
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    🚪 로그아웃
                  </button>
                </div>
              )}

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
                {profileUser.languageScores && profileUser.languageScores.length > 0 ? (
                  <div className="space-y-2">
                    {profileUser.languageScores.map((score) => (
                      <LanguageScoreCard key={score.id} score={score} />
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
                    <div className="cursor-pointer mt-4 sm:mt-0">
                      <button
                        onClick={() => {
                          router.push('/applications/edit');
                        }}
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
                          <UniversityItem
                            key={university.id}
                            university={university}
                            showRank={true}
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