import { User, University, LanguageScore, UniversityNotice, LanguageTestType } from '@/types';

// Mock 대학교 공지사항 데이터
const mockNotices: UniversityNotice[] = [
  {
    id: '1',
    title: '2025년 봄학기 교환학생 모집 안내',
    content: '2025년 봄학기 교환학생 모집을 시작합니다.',
    date: '2025년 7월 24일',
    url: 'www.konkuk.ac.kr'
  },
  {
    id: '2',
    title: '서류 제출 기한 연장 안내',
    content: '서류 제출 기한이 연장되었습니다.',
    date: '2025년 7월 20일',
  }
];

// Mock 대학교 데이터
export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Kansai University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 2, level2: 1 },
    notices: mockNotices,
    applicantCount: 15
  },
  {
    id: '2',
    name: 'Kanagawa University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 3, level2: 1 },
    notices: mockNotices,
    applicantCount: 12
  },
  {
    id: '3',
    name: 'Kyoto Sangyo University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 1, level2: 0 },
    notices: mockNotices,
    applicantCount: 8
  },
  {
    id: '4',
    name: 'Otemon Gakuin University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 2, level2: 1 },
    notices: mockNotices,
    applicantCount: 10
  },
  {
    id: '5',
    name: 'Kwansai Gakuin University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 3, level2: 1 },
    notices: mockNotices,
    applicantCount: 18
  },
  {
    id: '6',
    name: 'Orebro University',
    country: '스웨덴',
    flag: '🇸🇪',
    competitionRatio: { level1: 2, level2: 1 },
    notices: mockNotices,
    applicantCount: 6
  },
  {
    id: '7',
    name: 'Tilburg University',
    country: '네덜란드',
    flag: '🇳🇱',
    competitionRatio: { level1: 2, level2: 1 },
    notices: mockNotices,
    applicantCount: 4
  }
];

// Mock 어학 성적 데이터
const mockLanguageScores: LanguageScore[] = [
  {
    id: '1',
    type: 'TOEIC',
    score: '875',
    imageUrl: '/mock-images/toeic-score.jpg'
  },
  {
    id: '2',
    type: 'JLPT',
    score: 'N2',
    imageUrl: '/mock-images/jlpt-score.jpg'
  },
  {
    id: '3',
    type: 'TOEIC',
    score: '790',
    imageUrl: '/mock-images/toeic-score-2.jpg'
  },
  {
    id: '4',
    type: 'IELTS',
    score: '7.0',
    imageUrl: '/mock-images/ielts-score.jpg'
  }
];

// Mock 사용자 데이터
export const mockUsers: User[] = [
  {
    id: '1',
    uuid: 'user-uuid-1',
    name: '김학생',
    role: 'user',
    gpa: 3.8,
    gpaImageUrl: '/mock-images/gpa-1.jpg',
    languageScores: [mockLanguageScores[0], mockLanguageScores[1]],
    appliedUniversities: ['1', '2', '6'],
    verificationStatus: 'verified',
    editCount: 1,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '2',
    uuid: 'user-uuid-2',
    name: '이학생',
    role: 'user',
    gpa: 3.5,
    gpaImageUrl: '/mock-images/gpa-2.jpg',
    languageScores: [mockLanguageScores[2]],
    appliedUniversities: ['1', '3', '4'],
    verificationStatus: 'verified',
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '3',
    uuid: 'user-uuid-3',
    name: '박학생',
    role: 'user',
    gpa: 4.0,
    gpaImageUrl: '/mock-images/gpa-3.jpg',
    languageScores: [mockLanguageScores[3]],
    appliedUniversities: ['5', '6', '7'],
    verificationStatus: 'verified',
    editCount: 2,
    maxEditCount: 3,
    isDeadlineRestricted: true
  },
  {
    id: '4',
    uuid: 'user-uuid-4',
    name: '최학생',
    role: 'user',
    languageScores: [],
    appliedUniversities: ['1', '2'],
    verificationStatus: 'not_verified',
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '5',
    uuid: 'user-uuid-5',
    name: '정학생',
    role: 'user',
    gpa: 3.2,
    gpaImageUrl: '/mock-images/gpa-5.jpg',
    languageScores: [mockLanguageScores[0]],
    appliedUniversities: ['3', '4'],
    verificationStatus: 'pending',
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '6',
    uuid: 'admin-uuid-1',
    name: '관리자',
    role: 'admin',
    languageScores: [],
    appliedUniversities: [],
    verificationStatus: 'verified',
    editCount: 0,
    maxEditCount: 999,
    isDeadlineRestricted: false
  }
];

// 유틸리티 함수들
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getUserByUUID(uuid: string): User | undefined {
  return mockUsers.find(user => user.uuid === uuid);
}

export function getUniversityById(id: string): University | undefined {
  return mockUniversities.find(university => university.id === id);
}

export function getUniversityApplicants(universityId: string): User[] {
  return mockUsers.filter(user => 
    user.appliedUniversities.includes(universityId) && 
    user.verificationStatus === 'verified'
  );
}

export function getUserApplications(userId: string): University[] {
  const user = getUserById(userId);
  if (!user) return [];
  
  return user.appliedUniversities
    .map(univId => getUniversityById(univId))
    .filter(Boolean) as University[];
}

export const languageTestTypes: { value: LanguageTestType; label: string }[] = [
  { value: 'JLPT', label: 'JLPT' },
  { value: 'HSK', label: 'HSK' },
  { value: 'TOEIC', label: 'TOEIC' },
  { value: 'TOEFL_IBT', label: 'TOEFL IBT' },
  { value: 'TOEFL_ITP', label: 'TOEFL ITP' },
  { value: 'IELTS', label: 'IELTS' }
]; 