import { LanguageScore, LanguageTestType } from '@/types';

export const parseLangString = (langString: string): LanguageScore[] => {
  if (!langString) return [];
  
  // 여러 개의 어학 성적이 있을 수 있으므로 쉼표, 세미콜론, 여러 띄어쓰기로 구분
  const scores = langString.split(/[,;]|\s{2,}/).map(s => s.trim()).filter(s => s);
  
  return scores.map((scoreStr, index) => {
    let type: LanguageTestType = 'TOEFL_IBT'; // 기본값
    let level: string | undefined;
    let score: string | null = null;
    
    // JLPT N2 180, HSK 4급 200, Toefl 89, 토익 100 등 다양한 형태 처리
    const lowerScoreStr = scoreStr.toLowerCase();
    
    if (lowerScoreStr.includes('jlpt')) {
      type = 'JLPT';
      // JLPT N2 180, JLPT N2 형태 처리
      const jlptMatch = scoreStr.match(/jlpt\s+(n[1-5])(?:\s+(\d+))?/i);
      if (jlptMatch) {
        level = jlptMatch[1].toUpperCase(); // N1, N2 등
        score = jlptMatch[2] || null; // 세부 성적이 있으면 저장, 없으면 null
      }
    } else if (lowerScoreStr.includes('hsk')) {
      type = 'HSK';
      // HSK 4급 200, HSK 5급 형태 처리
      const hskMatch = scoreStr.match(/hsk\s+(\d+)급?(?:\s+(\d+))?/i);
      if (hskMatch) {
        level = `${hskMatch[1]}급`; // 4급, 5급 등
        score = hskMatch[2] || null; // 세부 성적이 있으면 저장, 없으면 null
      }
    } else {
      // TOEFL, TOEIC, IELTS 등 - 점수가 있을 수도 없을 수도 있음
      // 먼저 점수가 있는 패턴을 시도
      const withScoreMatch = scoreStr.match(/(\w+)\s+(\d+)/i);
      if (withScoreMatch) {
        const [, testName, scoreValue] = withScoreMatch;
        score = scoreValue;
        
        if (lowerScoreStr.includes('toefl')) {
          type = 'TOEFL_IBT';
        } else if (lowerScoreStr.includes('토익') || lowerScoreStr.includes('toeic')) {
          type = 'TOEIC';
        } else if (lowerScoreStr.includes('ielts')) {
          type = 'IELTS';
        }
      } else {
        // 점수가 없는 경우 (예: "TOEFL", "TOEIC", "IELTS")
        if (lowerScoreStr.includes('toefl')) {
          type = 'TOEFL_IBT';
        } else if (lowerScoreStr.includes('토익') || lowerScoreStr.includes('toeic')) {
          type = 'TOEIC';
        } else if (lowerScoreStr.includes('ielts')) {
          type = 'IELTS';
        }
      }
    }
    
    return {
      id: `lang-${index}`,
      type,
      level,
      score
    };
  }).filter(Boolean) as LanguageScore[];
};