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
import { calculateConvertedScore, sortApplicantsByRank } from '@/utils/scoreCalculation';
import { parseLangString } from '@/utils/languageParser';
import ConvertedScoreDisplay from '@/components/ConvertedScoreDisplay';
import LanguageScoreBadge from '@/components/LanguageScoreBadge';
import { getColorForValue } from '@/utils/colorUtils';
import { universitiesAPI } from '@/api';
import { useAnalytics } from '@/hooks/useAnalytics';

interface UniversityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityPage({ params }: UniversityPageProps) {
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
      } catch (error) {
        console.error('대학교 상세 정보 가져오기 오류:', error);
        
        // 403 에러인 경우 기본 대학 정보는 표시하고 권한 없음 상태로 설정
        if (error instanceof Error && error.message.includes('403')) {
          try {
            // 대학교 목록에서 기본 정보 가져오기
            const universities = await universitiesAPI.getUniversities();
            const targetUniversity = universities.find(u => u.id === resolvedParams.id);
            if (targetUniversity) {
              setUnauthorizedUniversityData({
                ...targetUniversity,
                applicants: []
              });
              setUnauthorizedUniversityName(targetUniversity.name);
            } else {
              setUnauthorizedUniversityName('해당 대학교');
            }
            setIsUnauthorized(true);
          } catch {
            setUnauthorizedUniversityName('해당 대학교');
            setIsUnauthorized(true);
          }
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchUniversityDetail();
  }, [resolvedParams, token]);

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
            title={displayUniversity.name}
            showBackButton={true}
            backButtonText="← 뒤로 가기"
            showHomeButton={true}
            universityFlag={getCountryFlag(displayUniversity.country)}
            universityName={displayUniversity.name}
          />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 대학교 정보 */}
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
                    onClick={() => handleSort('choice')}
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
                    onClick={() => handleSort('convertedScore')}
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
                    onClick={() => handleSort('grade')}
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
                    trackEvent('unauthorized_university_edit_attempt', 'access_control', `${displayUniversity.name}_${user.nickname}`);
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
                    <div
                      key={applicant.id}
                      className={`p-4 cursor-pointer ${
                        applicant.id === user?.id 
                          ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => router.push(`/profile/${applicant.id}`)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* 지망순위 */}
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0 ${
                          applicant.choice === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
                          applicant.choice === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
                          applicant.choice === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
                          applicant.choice === 4 ? 'bg-blue-500 text-white shadow-sm' :
                          applicant.choice === 5 ? 'bg-emerald-500 text-white shadow-sm' :
                          'bg-gray-500 text-white'
                        }`}>
                          {applicant.choice}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="text-sm font-medium text-gray-900">
                              {applicant.nickname}
                            </div>
                            {applicant.id === user?.id && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                내 정보
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 items-center">
<ConvertedScoreDisplay 
                              applicant={applicant}
                              variant="mobile"
                              className={getColorForValue('환산점수')}
                            />
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(applicant.grade.toString())}`}>
                              학점 {applicant.grade.toFixed(2)}
                            </span>
<LanguageScoreBadge 
                              langString={applicant.lang}
                              variant="mobile"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                        <tr
                          key={applicant.id}
                          className={`cursor-pointer ${
                            applicant.id === user?.id 
                              ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => router.push(`/profile/${applicant.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                                applicant.choice === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
                                applicant.choice === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
                                applicant.choice === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
                                applicant.choice === 4 ? 'bg-blue-500 text-white shadow-sm' :
                                applicant.choice === 5 ? 'bg-emerald-500 text-white shadow-sm' :
                                'bg-gray-500 text-white'
                              }`}>
                                {applicant.choice}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {applicant.nickname}
                              </div>
                              {applicant.id === user?.id && (
                                <div className="ml-2 flex items-center space-x-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    내 정보
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <ConvertedScoreDisplay applicant={applicant} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="font-semibold text-blue-600">
                                {applicant.grade.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <LanguageScoreBadge langString={applicant.lang} />
                          </td>
                        </tr>
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