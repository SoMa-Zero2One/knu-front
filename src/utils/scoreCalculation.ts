import { UniversityApplicant, LanguageScore, LanguageTestType } from '@/types';
import { scoreConversionTable } from './scoreConversionTable';
import { parseLangString } from './languageParser';

/**
 * 어학 성적에서 환산점수를 계산하는 함수
 * @param languageScores 파싱된 어학 성적 배열
 * @returns 환산점수
 */
function calculateLanguageScore(languageScores: LanguageScore[]): number {
  if (!languageScores || languageScores.length === 0) return 0;
  
  let maxScore = 0;
  
  for (const langScore of languageScores) {
    const score = getScoreFromTable(langScore);
    maxScore = Math.max(maxScore, score);
  }
  
  return maxScore;
}

/**
 * 개별 어학 성적을 환산표에서 찾아 점수를 반환
 * @param langScore 어학 성적 객체
 * @returns 환산점수
 */
function getScoreFromTable(langScore: LanguageScore): number {
  const { type, level, score } = langScore;
  
  // UNKNOWN 타입인 경우 0점 반환
  if (type === 'UNKNOWN') {
    return 0;
  }
  
  // 영어 성적 처리
  if (['TOEIC', 'TOEFL_IBT', 'TOEFL_ITP', 'IELTS', 'CEFR'].includes(type)) {
    return getEnglishScore(type, level, score);
  }
  
  // 제2외국어 성적 처리
  if (['JLPT', 'HSK', 'DELF', 'ZD', 'TORFL', 'DELE'].includes(type)) {
    return getSecondLanguageScore(type, level, score);
  }
  
  return 0;
}

/**
 * 영어 성적 환산점수 계산
 */
function getEnglishScore(type: LanguageTestType, level: string | undefined, score: string | null): number {
  if (!score) return 0;
  
  const numScore = parseInt(score);
  
  for (const entry of scoreConversionTable.영어) {
    let match = false;
    
    switch (type) {
      case 'TOEIC':
        match = isScoreInRange(numScore, entry.TOEIC);
        break;
      case 'TOEFL_IBT':
      case 'TOEFL_ITP':
        match = isScoreInRange(numScore, entry.TOEFL);
        break;
      case 'IELTS':
        match = numScore >= parseFloat(entry.IELTS);
        break;
      case 'CEFR':
        if (level) {
          match = entry.CEFR.includes(level);
        } else if (score) {
          // 영작문 점수만 있는 경우 점수 구간으로 판단
          const cefrScoreMatch = entry.CEFR.match(/(\d+)~(\d+)/);
          if (cefrScoreMatch) {
            const min = parseInt(cefrScoreMatch[1]);
            const max = parseInt(cefrScoreMatch[2]);
            match = numScore >= min && numScore <= max;
          }
        }
        break;
    }
    
    if (match) {
      return entry.점수;
    }
  }
  
  return 0;
}

/**
 * 제2외국어 성적 환산점수 계산
 */
function getSecondLanguageScore(type: LanguageTestType, level: string | undefined, score: string | null): number {
  for (const entry of scoreConversionTable.제2외국어) {
    let match = false;
    
    switch (type) {
      case 'JLPT':
        if (level && score) {
          const numScore = parseInt(score);
          const jlptEntry = entry["일본어(JLPT)"];
          match = jlptEntry.includes(level) && isScoreInRange(numScore, jlptEntry);
        } else if (level) {
          match = entry["일본어(JLPT)"].includes(level);
        }
        break;
      case 'HSK':
        if (level) {
          match = entry["중국어(HSK)"] === level;
        }
        break;
      case 'DELF':
        if (level) {
          match = entry["프랑스어(DELF)"] === level;
        }
        break;
      case 'ZD':
        if (level) {
          match = entry["독일어(ZD)"] === level;
        }
        break;
      case 'TORFL':
        if (level) {
          match = entry["러시아어(TORFL)"] === level;
        }
        break;
      case 'DELE':
        if (level) {
          match = entry["스페인어(DELE)"] === level;
        }
        break;
    }
    
    if (match) {
      return entry.점수;
    }
  }
  
  return 0;
}

/**
 * 점수가 범위 안에 있는지 확인하는 헬퍼 함수
 * @param score 확인할 점수
 * @param range 범위 문자열 (예: "900~944", "95~120")
 * @returns 범위 안에 있으면 true
 */
function isScoreInRange(score: number, range: string): boolean {
  const rangeMatch = range.match(/(\d+)~(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    return score >= min && score <= max;
  }
  
  // 단일 값인 경우 (예: "7.0")
  const singleValue = parseFloat(range);
  if (!isNaN(singleValue)) {
    return score >= singleValue;
  }
  
  return false;
}

/**
 * 환산점수 계산 함수
 * @param applicant 지원자 정보
 * @returns 환산점수
 */
export function calculateConvertedScore(applicant: UniversityApplicant): number {
  // 어학 성적 파싱 및 점수 계산
  const languageScores = parseLangString(applicant.lang || '');
  const langScore = calculateLanguageScore(languageScores);
  
  // 어학점수가 0점이면 전체 환산점수를 0점으로 처리
  if (langScore === 0) {
    return 0;
  }
  
  // 프로그램 타입 결정 (영어 성적이 있으면 영어 프로그램, 아니면 제2외국어 프로그램)
  const hasEnglishScore = languageScores.some(score => 
    ['TOEIC', 'TOEFL_IBT', 'TOEFL_ITP', 'IELTS', 'CEFR'].includes(score.type)
  );
  
  // 학점 점수 계산
  const gradeMultiplier = hasEnglishScore ? (50 / 4.5) : (40 / 4.5);
  const baseScore = applicant.grade * gradeMultiplier;
  
  return Math.round((baseScore + langScore) * 100) / 100;
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