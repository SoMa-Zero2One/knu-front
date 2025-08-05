'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UniversityDetail, UniversityApplicant } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getCountryFlag } from '@/utils/countryFlags';
import { calculateConvertedScore, sortApplicantsByRank } from '@/utils/scoreCalculation';
import { universitiesAPI } from '@/api';

interface UniversityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const router = useRouter();
  const { user, loading, token } = useAuth();
  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  const getColorForValue = (value: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-red-100 text-red-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-indigo-100 text-indigo-700',
      'bg-gray-100 text-gray-700',
      'bg-orange-100 text-orange-700',
      'bg-teal-100 text-teal-700',
      'bg-cyan-100 text-cyan-700',
      'bg-lime-100 text-lime-700',
      'bg-emerald-100 text-emerald-700',
      'bg-sky-100 text-sky-700',
      'bg-violet-100 text-violet-700',
      'bg-fuchsia-100 text-fuchsia-700',
      'bg-amber-100 text-amber-700',
      'bg-slate-100 text-slate-700',
      'bg-zinc-100 text-zinc-700',
    ];

    const hash = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
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

  if (!university) {
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


  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title={university.name}
        showBackButton={true}
        backButtonText="← 뒤로 가기"
        showHomeButton={true}
        universityFlag={getCountryFlag(university.country)}
        universityName={university.name}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 대학교 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">국가</h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{getCountryFlag(university.country)}</span>
                <p className="text-2xl text-blue-600 font-semibold">{university.country}</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">총 지원자 수</h3>
              <p className="text-3xl font-bold text-blue-600">{university.totalApplicants}명</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">모집인원</h3>
              <p className="text-3xl font-bold text-green-600">{university.slot}명</p>
            </div>
          </div>
        </div>

        {/* 지원자 목록 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                지원자 목록 ({university.applicants.length}명)
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                모든 지원자들의 성적 정보를 확인할 수 있습니다.
              </p>
            </div>
            
            {university.applicants.length > 0 ? (
              <>
                {/* 모바일 버전: 카드 형태 */}
                <div className="sm:hidden divide-y divide-gray-200">
                  {sortApplicantsByRank(university.applicants).map((applicant) => (
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
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue('환산점수')}`}>
                              환산점수 {calculateConvertedScore(applicant)}점
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(applicant.grade.toString())}`}>
                              학점 {applicant.grade.toFixed(2)}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorForValue(applicant.lang)}`}>
                              {applicant.lang}
                            </span>
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
                      {sortApplicantsByRank(university.applicants)
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
                              <span className="font-semibold text-purple-600">
                                {calculateConvertedScore(applicant)}점
                              </span>
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
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {applicant.lang}
                            </span>
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
    </div>
  );
} 