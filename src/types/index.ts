// 어학 성적 종류
export type LanguageTestType = 'JLPT' | 'HSK' | 'TOEIC' | 'TOEFL_IBT' | 'TOEFL_ITP' | 'IELTS';

// 어학 성적 인터페이스
export interface LanguageScore {
  id: string;
  type: LanguageTestType;
  level?: string; // JLPT N2, HSK 4급 등의 급수
  score: string | null; // 세부 성적 (없으면 null)
}




// 지원 대학교 정보 (순위 포함)
export interface AppliedUniversity {
  universityId: string;
  rank: number; // 지망순위 (1, 2, 3...)
}

// 사용자 인터페이스
export interface User {
  id: string;
  nickname: string;
  gpa?: number;
  languageScores?: LanguageScore[];
  appliedUniversities?: AppliedUniversity[]; // 지망순위 포함 대학교 목록
  editCount?: number; // 현재 편집 횟수
  maxEditCount?: number; // 최대 편집 횟수
}

// 대학교 인터페이스
export interface University {
  id: string;
  name: string;
  country: string;
  slot: number; // 모집인원
  applicantCount: number; // 지원자 수
}

// 대학교 지원자 정보
export interface UniversityApplicant {
  id: string;
  nickname: string;
  grade: number; // 학점
  lang: string; // 어학 성적
  choice: number; // 지망순위
  rank: number; // 학점 순위
}

// 대학교 상세 정보 (지원자 포함)
export interface UniversityDetail {
  name: string;
  country: string;
  slot: number;
  totalApplicants: number;
  applicants: UniversityApplicant[];
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