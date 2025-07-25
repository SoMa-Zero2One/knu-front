// 어학 성적 종류
export type LanguageTestType = 'JLPT' | 'HSK' | 'TOEIC' | 'TOEFL_IBT' | 'TOEFL_ITP' | 'IELTS';

// 어학 성적 인터페이스
export interface LanguageScore {
  id: string;
  type: LanguageTestType;
  score: string;
  imageUrl?: string;
}

// 사용자 역할
export type UserRole = 'user' | 'admin';

// 인증 상태
export type VerificationStatus = 'not_verified' | 'pending' | 'verified';

// 사용자 인터페이스
export interface User {
  id: string;
  uuid: string;
  name: string;
  role: UserRole;
  gpa?: number;
  gpaImageUrl?: string;
  languageScores: LanguageScore[];
  appliedUniversities: string[]; // university IDs
  verificationStatus: VerificationStatus;
  editCount: number;
  maxEditCount: number;
  isDeadlineRestricted: boolean; // 마감 3일 전 여부
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
  verificationStatus: VerificationStatus;
}

// JWT 페이로드
export interface JWTPayload {
  userId: string;
  uuid: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
} 