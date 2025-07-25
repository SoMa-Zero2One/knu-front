'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUniversityById, getUniversityApplicantsWithRank } from '@/data/mockData';
import { University, User } from '@/types';

interface UniversityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [applicants, setApplicants] = useState<Array<User & { rank: number }>>([]);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams?.id) {
      const univData = getUniversityById(resolvedParams.id);
      if (univData) {
        setUniversity(univData);
        const applicantData = getUniversityApplicantsWithRank(resolvedParams.id);
        setApplicants(applicantData);
      }
    }
  }, [resolvedParams]);

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

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  const canViewApplicants = user.verificationStatus === 'verified';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
                             <button
                 onClick={() => router.push('/dashboard')}
                 className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
               >
                 ← 돌아가기
               </button>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{university.flag}</span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {university.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.name}님 ({user.role === 'admin' ? '관리자' : '사용자'})
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 대학교 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">국가</h3>
              <p className="text-2xl">{university.country}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">총 지원자 수</h3>
              <p className="text-3xl font-bold text-blue-600">{university.applicantCount}명</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">모집인원</h3>
              <div className="space-y-2">
                <div className="flex justify-center items-center">
                  <span className="text-gray-600 mr-2">1학기:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {university.competitionRatio.level1}명
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-gray-600 mr-2">2학기:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    {university.competitionRatio.level2}명
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지원자 목록 */}
        {canViewApplicants ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                지원자 목록 ({applicants.length}명)
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                모든 지원자들의 성적 정보를 확인할 수 있습니다. (인증 상태별로 구분 표시됩니다)
              </p>
            </div>
            
            {applicants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지망순위
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        학점
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        어학 성적
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        인증 상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applicants
                      .sort((a, b) => a.rank - b.rank)
                      .map((applicant) => (
                      <tr
                        key={applicant.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/profile/${applicant.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
                            applicant.rank === 1 ? 'bg-yellow-500' :
                            applicant.rank === 2 ? 'bg-gray-400' :
                            applicant.rank === 3 ? 'bg-amber-600' :
                            'bg-blue-500'
                          }`}>
                            {applicant.rank}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {applicant.rank === 1 ? '1지망' :
                             applicant.rank === 2 ? '2지망' :
                             applicant.rank === 3 ? '3지망' :
                             `${applicant.rank}지망`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {applicant.gpa ? (
                              <span className="font-semibold text-blue-600">
                                {applicant.gpa.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400">미제출</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {applicant.languageScores.length > 0 ? (
                              applicant.languageScores.map((score) => (
                                <span
                                  key={score.id}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {score.type}: {score.score}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">어학 성적 없음</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            applicant.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : applicant.verificationStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {applicant.verificationStatus === 'verified' 
                              ? '인증 완료' 
                              : applicant.verificationStatus === 'pending'
                              ? '인증 진행 중'
                              : '미인증'
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        ) : (
          /* 미인증 사용자용 메시지 */
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-yellow-400 text-6xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              성적 인증이 필요합니다
            </h3>
            <p className="text-gray-600 mb-4">
              다른 지원자들의 성적 정보를 확인하려면 먼저 본인의 성적을 인증해주세요.
            </p>
            <button
              onClick={() => router.push('/verification')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              성적 인증하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 