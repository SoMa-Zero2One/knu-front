'use client';

import { University, User } from '@/types';
import { calculateConvertedScore } from '@/utils/scoreCalculation';
import { getCountryFlag } from '@/utils/countryFlags';
import Twemoji from 'react-twemoji';

interface ExtendedUniversityApplicant {
  id: string;
  nickname: string;
  grade: number;
  lang: string;
  choice: number;
  rank: number;
  admissionProbability: string;
}

interface AdmissionPredictionProps {
  user: User;
  appliedUniversities: Array<University & { rank: number }>;
  isMobile?: boolean;
}

// Mock 합격 예측 데이터 (실제 구현에서는 API를 통해 가져올 예정)
const getMockAdmissionData = (universityId: string) => {
  // 예시 데이터 - 실제로는 대학별로 다른 데이터를 반환
  return {
    totalApplicants: 10,
    slot: 3,
    competitionRate: 3.33,
    averageScore: 85.2,
    applicants: [
      { id: "5", nickname: "성실한 거북이", grade: 4.33, lang: "TOEFL 98", choice: 3, rank: 5, admissionProbability: "90%" },
      { id: "9", nickname: "차분한 고양이", grade: 4.18, lang: "TOEFL 102", choice: 3, rank: 9, admissionProbability: "85%" },
      { id: "3", nickname: "지혜로운 올빼미", grade: 4.15, lang: "IELTS 7.5", choice: 2, rank: 3, admissionProbability: "80%" },
      { id: "7", nickname: "든든한 코끼리", grade: 4.08, lang: "IELTS 7.0", choice: 1, rank: 7, admissionProbability: "60%" },
      { id: "6", nickname: "똑똑한 여우", grade: 3.92, lang: "TOEIC 875", choice: 2, rank: 6, admissionProbability: "50%" },
      { id: "2", nickname: "활기찬 독수리", grade: 3.89, lang: "TOEFL 105", choice: 1, rank: 2, admissionProbability: "45%" },
    ] as ExtendedUniversityApplicant[]
  };
};

// 사용자의 합격 가능성 계산 (환산점수 기준)
const calculateUserAdmissionProbability = (user: User, mockData: any) => {
  if (!user.gpa || !user.languageScores || user.languageScores.length === 0) {
    return 0;
  }

  // 사용자의 환산점수 계산
  const userScore = calculateConvertedScore({
    grade: user.gpa,
    lang: user.languageScores[0]?.testType + ' ' + user.languageScores[0]?.score
  });

  // Mock 데이터에서 환산점수 순위 계산
  const allScores = mockData.applicants.map((applicant: ExtendedUniversityApplicant) => 
    calculateConvertedScore(applicant)
  );
  allScores.push(userScore);
  allScores.sort((a, b) => b - a); // 내림차순 정렬

  const userRank = allScores.indexOf(userScore) + 1;
  const totalApplicants = allScores.length;
  const admissionSlots = mockData.slot;

  // 단순한 합격 가능성 계산
  if (userRank <= admissionSlots) {
    return Math.max(80, 100 - (userRank - 1) * 5);
  } else {
    const probability = Math.max(5, 80 - (userRank - admissionSlots) * 10);
    return probability;
  }
};

export default function AdmissionPrediction({ user, appliedUniversities, isMobile = false }: AdmissionPredictionProps) {
  if (!user.gpa || !user.languageScores || user.languageScores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            합격 예측을 위한 정보가 부족합니다
          </h3>
          <p className="text-gray-600 text-sm">
            정확한 합격 예측을 위해서는 학점과 어학 성적 정보가 필요합니다.
          </p>
        </div>
      </div>
    );
  }

  if (appliedUniversities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            지원한 대학교가 없습니다
          </h3>
          <p className="text-gray-600 text-sm">
            대학교를 지원한 후 합격 예측을 확인해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎯 합격 예측 (Mock Data)
        </h3>
        <p className="text-sm text-gray-600">
          Mock 데이터를 기반으로 한 합격 가능성 분석입니다.
        </p>
      </div>

      <div className="p-6">
        {isMobile ? (
          // 모바일 버전: 카드 형태
          <div className="space-y-4">
            {appliedUniversities
              .sort((a, b) => a.rank - b.rank)
              .map((university) => {
                const mockData = getMockAdmissionData(university.id);
                const probability = calculateUserAdmissionProbability(user, mockData);
                
                return (
                  <div key={university.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0 ${
                        university.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
                        university.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
                        university.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
                        'bg-blue-500 text-white shadow-sm'
                      }`}>
                        {university.rank}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Twemoji options={{ className: 'twemoji text-sm' }}>
                            <span>{getCountryFlag(university.country)}</span>
                          </Twemoji>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {university.name}
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                          <div>경쟁률: {mockData.competitionRate.toFixed(1)}:1</div>
                          <div>모집인원: {mockData.slot}명</div>
                        </div>
                        
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          probability >= 70 ? 'bg-green-100 text-green-800' :
                          probability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          probability >= 30 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          합격가능성 {probability}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // 데스크톱 버전: 테이블 형태
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
                    경쟁률
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
                {appliedUniversities
                  .sort((a, b) => a.rank - b.rank)
                  .map((university) => {
                    const mockData = getMockAdmissionData(university.id);
                    const probability = calculateUserAdmissionProbability(user, mockData);
                    
                    return (
                      <tr key={university.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            university.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' :
                            university.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-md' :
                            university.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md' :
                            'bg-blue-500 text-white shadow-sm'
                          }`}>
                            {university.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Twemoji options={{ className: 'twemoji text-sm' }}>
                              <span>{getCountryFlag(university.country)}</span>
                            </Twemoji>
                            <div className="text-sm font-medium text-gray-900">
                              {university.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {mockData.competitionRate.toFixed(1)}:1
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {mockData.slot}명
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            probability >= 70 ? 'bg-green-100 text-green-800' :
                            probability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            probability >= 30 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {probability}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            ℹ️ 이 예측은 Mock 데이터를 기반으로 한 것으로, 실제 결과와 다를 수 있습니다.
            정확한 정보는 각 대학교의 공식 발표를 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}