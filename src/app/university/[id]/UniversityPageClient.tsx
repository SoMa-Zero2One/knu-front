'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UniversityDetail, UniversityApplicant } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import UnauthorizedModal from '@/components/UnauthorizedModal';
import { getCountryFlag } from '@/utils/countryFlags';
import Twemoji from 'react-twemoji';
import { calculateConvertedScore } from '@/utils/scoreCalculation';
import ApplicantItem from '@/components/ApplicantItem';
import { universitiesAPI } from '@/api';
import { useAnalytics } from '@/hooks/useAnalytics';

interface UniversityPageClientProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityPageClient({ params }: UniversityPageClientProps) {
  const router = useRouter();
  const { user, loading, token } = useAuth();
  const { trackEvent } = useAnalytics();
  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [sortType, setSortType] = useState<'choice' | 'grade' | 'convertedScore'>('choice');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedUniversityName, setUnauthorizedUniversityName] = useState('');
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [unauthorizedUniversityData, setUnauthorizedUniversityData] = useState<any>(null);

  const getSortedApplicants = (applicants: UniversityApplicant[]) => {
    const sorted = [...applicants].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortType) {
        case 'grade':
          valueA = a.grade;
          valueB = b.grade;
          break;
        case 'convertedScore':
          valueA = calculateConvertedScore(a);
          valueB = calculateConvertedScore(b);
          break;
        case 'choice':
        default:
          valueA = a.choice;
          valueB = b.choice;
          break;
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return sorted;
  };

  const handleSort = (type: 'choice' | 'grade' | 'convertedScore') => {
    if (sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // 백엔드에서 대학교 상세 정보 가져오기
  useEffect(() => {
    const fetchUniversityDetail = async () => {
      if (!resolvedParams?.id || !token) return;

      try {
        const universityData = await universitiesAPI.getUniversityById(resolvedParams.id);
        setUniversity(universityData);
        
        // 대학교 페이지 조회 이벤트 추적
        if (user) {
          const safeNickname = user?.nickname
            ?.replace(/\s+/g, '_')
            ?.replace(/[^\w가-힣_]/g, '') || user?.id;
          
          const safeUniversityName = universityData.name
            ?.replace(/\s+/g, '_')
            ?.replace(/[^\w가-힣_]/g, '') || universityData.id;
          
          const isApplicant = universityData?.applicants?.some(applicant => applicant.id === user.id);
          const applicantStatus = isApplicant ? 1 : 0;
            
          trackEvent(`${safeUniversityName}_대학교_상세_조회`, 'university_interaction', `${safeNickname}_${applicantStatus}`);
        }
      } catch (error) {
        console.error('대학교 상세 정보 가져오기 오류:', error);
        
        // 403 에러인 경우 기본 대학 정보는 표시하고 권한 없음 상태로 설정
        if (error instanceof Error && error.message.includes('403')) {
          setUnauthorizedUniversityData({
            id: resolvedParams.id,
            name: '해당 대학교',
            country: 'Unknown',
            totalApplicants: 0,
            slot: 0,
            applicants: []
          });
          setUnauthorizedUniversityName('해당 대학교');
          setIsUnauthorized(true);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchUniversityDetail();
  }, [resolvedParams, token, user, trackEvent]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!university && !isUnauthorized) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">대학교를 찾을 수 없습니다</h1>
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

  const displayUniversity = university || unauthorizedUniversityData;

  return (
    <div className="min-h-screen bg-transparent">
      {/* 403 에러 모달 */}
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        universityName={unauthorizedUniversityName}
      />

      {displayUniversity && (
        <>
          <Header 
            title={isUnauthorized ? "대학 정보" : displayUniversity.name}
            showBackButton={true}
            showHomeButton={true}
            universityFlag={isUnauthorized ? undefined : getCountryFlag(displayUniversity.country)}
            universityName={isUnauthorized ? undefined : displayUniversity.name}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
            {/* 대학교 정보 - 권한이 있는 경우만 표시 */}
            {!isUnauthorized && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">국가</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <Twemoji options={{ className: 'twemoji text-2xl' }}>
                        <span>{getCountryFlag(displayUniversity.country)}</span>
                      </Twemoji>
                      <p className="text-2xl text-blue-600 font-semibold">{displayUniversity.country}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">총 지원자 수</h3>
                    <p className="text-3xl font-bold text-blue-600">{displayUniversity.totalApplicants}명</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">모집인원</h3>
                    <p className="text-3xl font-bold text-green-600">{displayUniversity.slot}명</p>
                  </div>
                </div>
              </div>
            )}

            {/* 지원자 목록 또는 접근 제한 안내 */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                {isUnauthorized ? (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      지원자 목록
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 mb-4">
                      지원하신 대학의 세부 사항만 확인하실 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      지원자 목록 ({displayUniversity.applicants.length}명)
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 mb-4">
                      모든 지원자들의 성적 정보를 확인할 수 있습니다.
                    </p>
                  </div>
                )}
                
                {/* 권한이 있는 경우만 정렬 버튼 표시 */}
                {!isUnauthorized && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const safeNickname = user?.nickname
                          ?.replace(/\s+/g, '_')
                          ?.replace(/[^\w가-힣_]/g, '') || user?.id;
                        console.log('Tracking button click:', '지망순위순_정렬', safeNickname);
                        trackEvent('지망순위순_정렬', 'button', safeNickname);
                        handleSort('choice');
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        sortType === 'choice' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      지망순위
                      {sortType === 'choice' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const safeNickname = user?.nickname
                          ?.replace(/\s+/g, '_')
                          ?.replace(/[^\w가-힣_]/g, '') || user?.id;
                        trackEvent('환산점수순_정렬', 'button', safeNickname);
                        handleSort('convertedScore');
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        sortType === 'convertedScore' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      환산점수
                      {sortType === 'convertedScore' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const safeNickname = user?.nickname
                          ?.replace(/\s+/g, '_')
                          ?.replace(/[^\w가-힣_]/g, '') || user?.id;
                        trackEvent('학점순_정렬', 'button', safeNickname);
                        handleSort('grade');
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        sortType === 'grade' 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      학점
                      {sortType === 'grade' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {isUnauthorized ? (
                /* 권한 없음 안내 */
                <div className="p-8 text-center">
                  <div className="text-orange-500 text-6xl mb-4">🔒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    접근 권한이 필요합니다
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    <strong>{displayUniversity.name}</strong>는 지원하지 않은 대학입니다.<br />
                    지원 대학을 변경한 후 세부내용을 확인해주세요.
                  </p>
                  <button
                    onClick={() => {
                      trackEvent('unauthorized_university_edit_attempt', 'access_control', `${displayUniversity.name.replace(/\s+/g, '_')}_${user.nickname?.replace(/\s+/g, '_')}`);
                      router.push('/applications/edit');
                    }}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    지원 대학 수정하기
                  </button>
                </div>
              ) : displayUniversity.applicants.length > 0 ? (
                <>
                  {/* 모바일 버전: 카드 형태 */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {getSortedApplicants(displayUniversity.applicants).map((applicant) => (
                      <ApplicantItem
                        key={applicant.id}
                        applicant={applicant}
                        isMobile={true}
                        universityName={displayUniversity.name}
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
                            닉네임
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            환산점수
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            학점
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            어학 성적
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getSortedApplicants(displayUniversity.applicants)
                          .map((applicant) => (
                            <ApplicantItem
                              key={applicant.id}
                              applicant={applicant}
                              isMobile={false}
                              universityName={displayUniversity.name}
                            />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    아직 지원자가 없습니다
                  </h3>
                  <p className="text-gray-600">
                    이 대학교에 지원한 사람이 아직 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <BottomNavigation />
        </>
      )}
    </div>
  );
}