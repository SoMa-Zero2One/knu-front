// 어학 성적 종류
export type LanguageTestType = 'JLPT' | 'HSK' | 'TOEIC' | 'TOEFL_IBT' | 'TOEFL_ITP' | 'IELTS';

// 어학 성적 인터페이스
export interface LanguageScore {
  id: string;
  type: LanguageTestType;
  score: string;
  imageUrl?: string;
}




// 지원 대학교 정보 (순위 포함)
export interface AppliedUniversity {
  universityId: string;
  rank: number; // 지망순위 (1, 2, 3...)
}

// 사용자 인터페이스
export interface User {
  id: string;
  uuid: string;
  name: string;
  gpa?: number;
  languageScores: LanguageScore[];
  appliedUniversities: AppliedUniversity[]; // 지망순위 포함 대학교 목록
  editCount: number; // 현재 편집 횟수
  maxEditCount: number; // 최대 편집 횟수
  isDeadlineRestricted: boolean; // 마감 기한 제한 여부
}

// 대학교 공지사항
export interface UniversityNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  url?: string;
}

// 대학교 인터페이스
export interface University {
  id: string;
  name: string;
  country: string;
  flag: string;
  competitionRatio: {
    level1: number; // 1개 학기
    level2: number; // 2개 학기
  };
  notices: UniversityNotice[];
  applicantCount: number;
}

// 대학교 지원자 정보
export interface UniversityApplicant {
  userId: string;
  userName: string;
  gpa?: number;
  languageScores: LanguageScore[];
  rank: number; // 지망순위
}

// JWT 페이로드
export interface JWTPayload {
  userId: string;
  uuid: string;
  exp?: number;
  iat?: number;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
} 