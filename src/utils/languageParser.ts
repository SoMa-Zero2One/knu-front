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
      } else {
        // JLPT 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('hsk') || lowerScoreStr.includes('중국어')) {
      type = 'HSK';
      // HSK 4급 200, HSK 5급, 중국어 4급 형태 처리
      const hskMatch = scoreStr.match(/(?:hsk|중국어)\s+(\d+)급?(?:\s+(\d+))?/i);
      if (hskMatch) {
        const level_num = parseInt(hskMatch[1]);
        // HSK는 1급~6급만 유효
        if (level_num >= 1 && level_num <= 6) {
          level = `${hskMatch[1]}급`; // 4급, 5급 등
          score = hskMatch[2] || null; // 세부 성적이 있으면 저장, 없으면 null
        } else {
          type = 'UNKNOWN';
        }
      } else {
        // HSK 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('일본어') && !lowerScoreStr.includes('jlpt')) {
      type = 'JLPT';
      // 일본어 N2 형태 처리 (JLPT가 명시되지 않은 경우)
      const jlptMatch = scoreStr.match(/일본어\s+(n[1-5])(?:\s+(\d+))?/i);
      if (jlptMatch) {
        level = jlptMatch[1].toUpperCase(); // N1, N2 등
        score = jlptMatch[2] || null;
      } else {
        // 일본어 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('cefr') || lowerScoreStr.includes('iwc') || lowerScoreStr.includes('영작문') || lowerScoreStr.includes('진단')) {
      type = 'CEFR';
      // CEFR B2, C1, IWC B2, 영작문 B2, 진단평가 B2 형태 처리
      const cefrMatch = scoreStr.match(/(?:cefr|iwc|영작문|진단).*?([a-c][1-2])(?:\s+(\d+))?/i);
      if (cefrMatch) {
        level = cefrMatch[1].toUpperCase(); // B2, C1 등
        score = cefrMatch[2] || null;
      } else {
        // CEFR 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('delf') || lowerScoreStr.includes('프랑스어')) {
      type = 'DELF';
      // DELF B2, C1, 프랑스어 B2 형태 처리
      const delfMatch = scoreStr.match(/(?:delf|프랑스어)\s+([a-c][1-2])(?:\s+(\d+))?/i);
      if (delfMatch) {
        level = delfMatch[1].toUpperCase();
        score = delfMatch[2] || null;
      } else {
        // DELF 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('zd') || lowerScoreStr.includes('독일어')) {
      type = 'ZD';
      // ZD B2, C1, 독일어 B2 형태 처리
      const zdMatch = scoreStr.match(/(?:zd|독일어)\s+([a-c][1-2])(?:\s+(\d+))?/i);
      if (zdMatch) {
        level = zdMatch[1].toUpperCase();
        score = zdMatch[2] || null;
      } else {
        // ZD 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('torfl') || lowerScoreStr.includes('러시아어')) {
      type = 'TORFL';
      // TORFL 기초, 기본, 1단계, 1, 러시아어 기초 등 처리
      const torflMatch = scoreStr.match(/(?:torfl|러시아어)\s+(기초|기본|\d+단계|\d+)(?:\s+(\d+))?/i);
      if (torflMatch) {
        const matchedLevel = torflMatch[1];
        // 숫자만 있는 경우 "N단계" 형태로 변환
        if (/^\d+$/.test(matchedLevel)) {
          level = `${matchedLevel}단계`;
        } else {
          level = matchedLevel;
        }
        score = torflMatch[2] || null;
      } else {
        // TORFL 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else if (lowerScoreStr.includes('dele') || lowerScoreStr.includes('스페인어')) {
      type = 'DELE';
      // DELE B2, C1, 스페인어 B2 형태 처리
      const deleMatch = scoreStr.match(/(?:dele|스페인어)\s+([a-c][1-2])(?:\s+(\d+))?/i);
      if (deleMatch) {
        level = deleMatch[1].toUpperCase();
        score = deleMatch[2] || null;
      } else {
        // DELE 패턴이 맞지 않으면 UNKNOWN으로 설정
        type = 'UNKNOWN';
      }
    } else {
      // TOEFL, TOEIC, IELTS 등 - 점수가 있을 수도 없을 수도 있음
      // 먼저 점수가 있는 패턴을 시도
      const withScoreMatch = scoreStr.match(/([\w가-힣]+)\s+(\d+)/i);
      if (withScoreMatch) {
        const [, testName, scoreValue] = withScoreMatch;
        score = scoreValue;
        
        if (lowerScoreStr.includes('toefl') || lowerScoreStr.includes('토플')) {
          type = 'TOEFL_IBT';
        } else if (lowerScoreStr.includes('토익') || lowerScoreStr.includes('toeic')) {
          type = 'TOEIC';
        } else if (lowerScoreStr.includes('ielts') || lowerScoreStr.includes('아이엘츠')) {
          type = 'IELTS';
        } else {
          // 알 수 없는 어학시험인 경우 UNKNOWN으로 설정
          type = 'UNKNOWN';
        }
      } else {
        // 점수가 없는 경우 (예: "TOEFL", "토플", "TOEIC", "토익", "IELTS", "아이엘츠")
        if (lowerScoreStr.includes('toefl') || lowerScoreStr.includes('토플')) {
          type = 'TOEFL_IBT';
        } else if (lowerScoreStr.includes('토익') || lowerScoreStr.includes('toeic')) {
          type = 'TOEIC';
        } else if (lowerScoreStr.includes('ielts') || lowerScoreStr.includes('아이엘츠')) {
          type = 'IELTS';
        } else {
          // 알 수 없는 입력인 경우 UNKNOWN으로 설정
          type = 'UNKNOWN';
        }
      }
    }
    
    return {
      id: `lang-${index}`,
      type,
      level,
      score,
      originalString: type === 'UNKNOWN' ? scoreStr : undefined
    };
  }).filter(Boolean) as LanguageScore[];
};