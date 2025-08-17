'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, University, LanguageScore } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import LanguageScoreCard from '@/components/LanguageScoreCard';
import UniversityItem from '@/components/UniversityItem';

// Mock 사용자 데이터
const mockUser: User = {
  id: "mock-user-1",
  nickname: "차분한 고양이",
  gpa: 4.18,
  languageScores: [
    {
      id: "lang-1",
      testType: "TOEFL",
      score: "102",
      date: "2024-03-15"
    },
    {
      id: "lang-2", 
      testType: "IELTS",
      score: "7.5",
      date: "2024-02-10"
    }
  ],
  appliedUniversities: []
};

// Mock 지원 대학교 데이터 (합격 예측 포함)
const mockAppliedUniversities: Array<University & { rank: number; admissionProbability: string }> = [
  {
    id: "univ-1",
    name: "베를린 훔볼트 대학교",
    country: "독일",
    slot: 3,
    applicantCount: 10,
    rank: 1,
    admissionProbability: "85%"
  },
  {
    id: "univ-2", 
    name: "뮌헨 루드비히 막시밀리안 대학교",
    country: "독일",
    slot: 2,
    applicantCount: 8,
    rank: 2,
    admissionProbability: "72%"
  },
  {
    id: "univ-3",
    name: "취리히 연방 공과대학교",
    country: "스위스", 
    slot: 1,
    applicantCount: 5,
    rank: 3,
    admissionProbability: "45%"
  },
  {
    id: "univ-4",
    name: "암스테르담 대학교",
    country: "네덜란드",
    slot: 4,
    applicantCount: 12,
    rank: 4,
    admissionProbability: "90%"
  }
];

export default function MockProfilePage() {
  const router = useRouter();
  const [expandedGrades, setExpandedGrades] = useState(false);
  const [expandedUniversities, setExpandedUniversities] = useState(true);

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title={`${mockUser.nickname}님의 프로필 (Mock)`}
        showBackButton={true}
        showHomeButton={true}
        hideProfileButton={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 모바일: 아코디언 스타일 */}
        <div className="block lg:hidden mb-8">
          {/* Mock 데이터 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-blue-600 text-xl mr-2">ℹ️</div>
              <div>
                <h4 className="font-medium text-blue-800">Mock 프로필 데이터</h4>
                <p className="text-sm text-blue-700 mt-1">
                  실제 데이터가 아닌 테스트용 Mock 데이터입니다.
                </p>
              </div>
            </div>
          </div>

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
                    성적 정보 ({mockUser.languageScores?.length || 0}개 어학 성적)
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
                    {mockUser.gpa ? (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-lg font-bold text-blue-900">
                          {mockUser.gpa.toFixed(2)} / 4.5
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">정보 없음</p>
                    )}
                  </div>

                  {/* 어학 성적 */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">어학 성적</h4>
                    {mockUser.languageScores && mockUser.languageScores.length > 0 ? (
                      <div className="space-y-2">
                        {mockUser.languageScores.map((score) => (
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
                    지원 대학 목록 ({mockAppliedUniversities.length}개)
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
                      Mock 데이터로 생성된 지원 대학교 목록입니다.
                    </p>
                  </div>
                  
                  {mockAppliedUniversities.length > 0 ? (
                    <>
                      {/* 모바일 버전: 카드 형태 */}
                      <div className="sm:hidden space-y-2">
                        {mockAppliedUniversities
                          .sort((a, b) => a.rank - b.rank)
                          .map((university) => (
                            <UniversityItem
                              key={university.id}
                              university={university}
                              showRank={true}
                              isMobile={true}
                              showAdmissionProbability={true}
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
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                합격가능성
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockAppliedUniversities
                              .sort((a, b) => a.rank - b.rank)
                              .map((university) => (
                                <UniversityItem
                                  key={university.id}
                                  university={university}
                                  showRank={true}
                                  isMobile={false}
                                  showAdmissionProbability={true}
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
                        아직 지원한 대학교가 없습니다.
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
          {/* Mock 데이터 안내 - 데스크톱 */}
          <div className="lg:col-span-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-blue-600 text-xl mr-2">ℹ️</div>
                <div>
                  <h4 className="font-medium text-blue-800">Mock 프로필 데이터</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    실제 데이터가 아닌 테스트용 Mock 데이터로 생성된 프로필입니다. 합격 예측 기능을 테스트해보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 왼쪽: 사용자 정보 */}
          <div className="lg:col-span-1">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">
                    {mockUser.nickname.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {mockUser.nickname}
                </h2>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Mock 사용자
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {mockAppliedUniversities.length}
                  </p>
                  <p className="text-sm text-gray-600">지원 대학교</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {mockUser.languageScores?.length || 0}
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
                {mockUser.gpa ? (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-900">
                      {mockUser.gpa.toFixed(2)} / 4.5
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">정보 없음</p>
                )}
              </div>

              {/* 어학 성적 */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">어학 성적</h4>
                {mockUser.languageScores && mockUser.languageScores.length > 0 ? (
                  <div className="space-y-2">
                    {mockUser.languageScores.map((score) => (
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
            {/* 지원 대학교 목록 */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      지원한 대학교 목록 ({mockAppliedUniversities.length}개)
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Mock 데이터로 생성된 지원 대학교 목록입니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {mockAppliedUniversities.length > 0 ? (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          합격가능성
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockAppliedUniversities
                        .sort((a, b) => a.rank - b.rank)
                        .map((university) => (
                          <UniversityItem
                            key={university.id}
                            university={university}
                            showRank={true}
                            showAdmissionProbability={true}
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
                    아직 지원한 대학교가 없습니다.
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