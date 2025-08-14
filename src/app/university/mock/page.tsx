'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UniversityDetail, UniversityApplicant } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { getCountryFlag } from '@/utils/countryFlags';
import Twemoji from 'react-twemoji';
import { calculateConvertedScore } from '@/utils/scoreCalculation';
import ApplicantItem from '@/components/ApplicantItem';

// Mock 데이터에 합격가능성 필드 추가를 위한 확장된 타입 정의
interface ExtendedUniversityApplicant extends UniversityApplicant {
  admissionProbability: string; // 합격가능성
}

interface ExtendedUniversityDetail extends Omit<UniversityDetail, 'applicants'> {
  applicants: ExtendedUniversityApplicant[];
}

// Mock 데이터 (환산점수 기준 합격가능성)
const mockUniversityData: ExtendedUniversityDetail = {
  name: "베를린 훔볼트 대학교",
  country: "독일",
  slot: 3,
  totalApplicants: 10,
  applicants: [
    // 환산점수 순서: 성실한 거북이(1등) → 차분한 고양이(2등) → 지혜로운 올빼미(3등) → 든든한 코끼리(4등) → 활기찬 독수리(5등) → 용감한 호랑이(6등)
    { id: "5", nickname: "성실한 거북이", grade: 4.33, lang: "TOEFL 98", choice: 3, rank: 5, admissionProbability: "90%" },
    { id: "9", nickname: "차분한 고양이", grade: 4.18, lang: "TOEFL 102", choice: 3, rank: 9, admissionProbability: "85%" },
    { id: "3", nickname: "지혜로운 올빼미", grade: 4.15, lang: "IELTS 7.5", choice: 2, rank: 3, admissionProbability: "80%" },
    { id: "7", nickname: "든든한 코끼리", grade: 4.08, lang: "IELTS 7.0", choice: 1, rank: 7, admissionProbability: "60%" },
    { id: "6", nickname: "똑똑한 여우", grade: 3.92, lang: "TOEIC 875", choice: 2, rank: 6, admissionProbability: "50%" },
    { id: "2", nickname: "활기찬 독수리", grade: 3.89, lang: "TOEFL 105", choice: 1, rank: 2, admissionProbability: "45%" },
    { id: "10", nickname: "밝은 햇살", grade: 3.85, lang: "TOEIC 890", choice: 1, rank: 10, admissionProbability: "35%" },
    { id: "8", nickname: "날렵한 매", grade: 3.73, lang: "TOEIC 820", choice: 2, rank: 8, admissionProbability: "25%" },
    { id: "4", nickname: "빠른 치타", grade: 3.67, lang: "TOEIC 845", choice: 1, rank: 4, admissionProbability: "20%" },
    { id: "1", nickname: "용감한 호랑이", grade: 4.21, lang: "TOEIC 900", choice: 1, rank: 1, admissionProbability: "15%" }
  ]
};

export default function MockUniversityPage() {
  const router = useRouter();
  const [sortType, setSortType] = useState<'choice' | 'grade' | 'convertedScore'>('choice');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getSortedApplicants = (applicants: ExtendedUniversityApplicant[]) => {
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

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
        title={mockUniversityData.name}
        showBackButton={true}
        showHomeButton={true}
        universityFlag={getCountryFlag(mockUniversityData.country)}
        universityName={mockUniversityData.name}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* 대학교 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">국가</h3>
              <div className="flex items-center justify-center space-x-2">
                <Twemoji options={{ className: 'twemoji text-2xl' }}>
                  <span>{getCountryFlag(mockUniversityData.country)}</span>
                </Twemoji>
                <p className="text-2xl text-blue-600 font-semibold">{mockUniversityData.country}</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">총 지원자 수</h3>
              <p className="text-3xl font-bold text-blue-600">{mockUniversityData.totalApplicants}명</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">모집인원</h3>
              <p className="text-3xl font-bold text-green-600">{mockUniversityData.slot}명</p>
            </div>
          </div>
        </div>

        {/* 지원자 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                지원자 목록 ({mockUniversityData.applicants.length}명)
              </h2>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Mock 데이터로 생성된 지원자들의 성적 정보입니다.
              </p>
            </div>
            
            {/* 정렬 버튼 */}
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
          </div>
          
          {/* 모바일 버전: 카드 형태 */}
          <div className="sm:hidden divide-y divide-gray-200">
            {getSortedApplicants(mockUniversityData.applicants).map((applicant) => (
              <div
                key={applicant.id}
                className="p-4 cursor-pointer hover:bg-gray-50"
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
                    </div>
                    
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                        환산점수 {calculateConvertedScore(applicant).toFixed(2)}
                      </span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        학점 {applicant.grade.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {applicant.lang}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        parseInt(applicant.admissionProbability) >= 70 ? 'bg-green-100 text-green-800' :
                        parseInt(applicant.admissionProbability) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        parseInt(applicant.admissionProbability) >= 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        합격가능성 {applicant.admissionProbability}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    합격가능성
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedApplicants(mockUniversityData.applicants)
                  .map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 cursor-pointer"
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-semibold text-purple-600">
                            {calculateConvertedScore(applicant).toFixed(2)}
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {applicant.lang}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          parseInt(applicant.admissionProbability) >= 70 ? 'bg-green-100 text-green-800' :
                          parseInt(applicant.admissionProbability) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          parseInt(applicant.admissionProbability) >= 30 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {applicant.admissionProbability}
                        </span>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}