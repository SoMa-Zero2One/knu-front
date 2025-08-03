import { UniversityApplicant } from '@/types';

/**
 * 환산점수 계산 함수
 * TODO: 실제 계산 로직은 나중에 구현
 * @param applicant 지원자 정보
 * @returns 환산점수
 */
export function calculateConvertedScore(applicant: UniversityApplicant): number {
  // 임시 계산 로직 (실제 로직으로 대체 예정)
  // 학점 * 25 + 어학점수 보정값
  const baseScore = applicant.grade * 25;
  
  // 어학 성적에 따른 보정값 (임시)
  let langBonus = 0;
  if (applicant.lang) {
    // 간단한 보정값 계산 (실제로는 더 복잡한 로직 필요)
    langBonus = 10; // 기본 보정값
  }
  
  return Math.round(baseScore + langBonus);
}

/**
 * 여러 지원자의 환산점수를 계산하고 순위를 매기는 함수
 * @param applicants 지원자 배열
 * @returns 환산점수와 순위가 추가된 지원자 배열
 */
export function calculateScoresAndRanks(applicants: UniversityApplicant[]) {
  // 각 지원자의 환산점수 계산
  const applicantsWithScores = applicants.map(applicant => ({
    ...applicant,
    convertedScore: calculateConvertedScore(applicant)
  }));
  
  // 환산점수 기준으로 정렬 (높은 점수부터)
  applicantsWithScores.sort((a, b) => b.convertedScore - a.convertedScore);
  
  // 순위 부여 (동점자 처리 포함)
  let currentRank = 1;
  for (let i = 0; i < applicantsWithScores.length; i++) {
    if (i > 0 && applicantsWithScores[i].convertedScore < applicantsWithScores[i - 1].convertedScore) {
      currentRank = i + 1;
    }
    applicantsWithScores[i].rank = currentRank;
  }
  
  return applicantsWithScores;
}

/**
 * 지원자 정렬 함수 (rank 기준)
 * @param applicants 지원자 배열
 * @returns rank 기준으로 정렬된 배열
 */
export function sortApplicantsByRank(applicants: UniversityApplicant[]) {
  return [...applicants].sort((a, b) => a.rank - b.rank);
}