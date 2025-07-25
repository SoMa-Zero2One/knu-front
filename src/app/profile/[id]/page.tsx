'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById, getUserApplications } from '@/data/mockData';
import { User, University } from '@/types';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { user: currentUser, loading } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [appliedUniversities, setAppliedUniversities] = useState<University[]>([]);
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
      const userData = getUserById(resolvedParams.id);
      if (userData) {
        setProfileUser(userData);
        const applications = getUserApplications(resolvedParams.id);
        setAppliedUniversities(applications);
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

  if (!currentUser) {
    router.push('/');
    return null;
  }

  if (currentUser.verificationStatus !== 'verified' && currentUser.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
                             <button
                 onClick={() => router.back()}
                 className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
               >
                 ← 돌아가기
               </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileUser.name}님의 프로필
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser.name}님 ({currentUser.role === 'admin' ? '관리자' : '사용자'})
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 사용자 정보 */}
          <div className="lg:col-span-1">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl">👤</div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {profileUser.name}
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profileUser.verificationStatus === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : profileUser.verificationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileUser.verificationStatus === 'verified' 
                    ? '✅ 인증 완료' 
                    : profileUser.verificationStatus === 'pending'
                    ? '⏳ 인증 진행 중'
                    : '❌ 미인증'
                  }
                </span>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4">
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
            {profileUser.verificationStatus === 'verified' && (
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
            )}
          </div>

          {/* 오른쪽: 지원 대학교 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  지원 대학교 목록 ({appliedUniversities.length}개)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {profileUser.name}님이 지원한 대학교들입니다. 대학교를 클릭하면 해당 대학교의 다른 지원자들을 확인할 수 있습니다.
                </p>
              </div>
              
              {appliedUniversities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                      {appliedUniversities.map((university) => (
                        <tr
                          key={university.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/university/${university.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{university.flag}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {university.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {university.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {university.applicantCount}명
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">1학기:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {university.competitionRatio.level1}명
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">2학기:</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  {university.competitionRatio.level2}명
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
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
                    {profileUser.name}님이 아직 지원한 대학교가 없습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 관리자용 추가 정보 */}
            {currentUser.role === 'admin' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  🔧 관리자 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-yellow-700">수정 횟수</p>
                    <p className="text-yellow-600">{profileUser.editCount} / {profileUser.maxEditCount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-700">마감 제한</p>
                    <p className="text-yellow-600">
                      {profileUser.isDeadlineRestricted ? '제한됨' : '제한 없음'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-700">사용자 ID</p>
                    <p className="text-yellow-600">{profileUser.id}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/admin/users/${profileUser.id}`)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
                  >
                    관리자 페이지에서 수정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 