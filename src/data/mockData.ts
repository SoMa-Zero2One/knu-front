import { User, University, LanguageScore, LanguageTestType, AppliedUniversity } from '@/types';

// Mock 대학교 데이터
export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Kansai University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 2, level2: 1 },
    applicantCount: 15,
    duration: '1학기 또는 2학기'
  },
  {
    id: '2',
    name: 'Kanagawa University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 3, level2: 1 },
    applicantCount: 12,
    duration: '1학기 또는 2학기'
  },
  {
    id: '3',
    name: 'Kyoto Sangyo University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 1, level2: 0 },
    applicantCount: 8,
    duration: '1학기만'
  },
  {
    id: '4',
    name: 'Otemon Gakuin University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 2, level2: 1 },
    applicantCount: 10,
    duration: '1학기 또는 2학기'
  },
  {
    id: '5',
    name: 'Kwansai Gakuin University',
    country: '일본',
    flag: '🇯🇵',
    competitionRatio: { level1: 3, level2: 1 },
    applicantCount: 18,
    duration: '1학기 또는 2학기'
  },
  {
    id: '6',
    name: 'Orebro University',
    country: '스웨덴',
    flag: '🇸🇪',
    competitionRatio: { level1: 2, level2: 1 },
    applicantCount: 6,
    duration: '1학기 또는 2학기'
  },
  {
    id: '8',
    name: 'Orebro University',
    country: '스웨덴',
    flag: '🇸🇪',
    competitionRatio: { level1: 2, level2: 1 },
    applicantCount: 6,
    duration: undefined
  },
  {
    id: '7',
    name: 'Tilburg University',
    country: '네덜란드',
    flag: '🇳🇱',
    competitionRatio: { level1: 2, level2: 1 },
    applicantCount: 4,
    duration: '1학기 또는 2학기'
  }
];

// Mock 어학 성적 데이터
const mockLanguageScores: LanguageScore[] = [
  {
    id: '1',
    type: 'TOEIC',
    score: '875',
  },
  {
    id: '2',
    type: 'JLPT',
    score: 'N2',
  },
  {
    id: '3',
    type: 'TOEIC',
    score: '790',
  },
  {
    id: '4',
    type: 'IELTS',
    score: '7.0',
  }
];

// Mock 사용자 데이터
export const mockUsers: User[] = [
  {
    id: '1',
    uuid: 'user-uuid-1',
    name: '김학생',
    gpa: 3.8,
    languageScores: [mockLanguageScores[0], mockLanguageScores[1]],
    appliedUniversities: [
      { universityId: '1', rank: 1 },
      { universityId: '2', rank: 2 },
      { universityId: '6', rank: 3 }
    ],
    editCount: 1,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '2',
    uuid: 'user-uuid-2',
    name: '이학생',
    gpa: 3.5,
    languageScores: [mockLanguageScores[2]],
    appliedUniversities: [
      { universityId: '1', rank: 2 },
      { universityId: '3', rank: 1 },
      { universityId: '4', rank: 3 }
    ],
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '3',
    uuid: 'user-uuid-3',
    name: '박학생',
    gpa: 4.0,
    languageScores: [mockLanguageScores[3]],
    appliedUniversities: [
      { universityId: '5', rank: 1 },
      { universityId: '6', rank: 2 },
      { universityId: '7', rank: 3 }
    ],
    editCount: 2,
    maxEditCount: 3,
    isDeadlineRestricted: true
  },
  {
    id: '4',
    uuid: 'user-uuid-4',
    name: '최학생',
    languageScores: [],
    appliedUniversities: [
      { universityId: '1', rank: 1 },
      { universityId: '2', rank: 2 }
    ],
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
  {
    id: '5',
    uuid: 'user-uuid-5',
    name: '정학생',
    gpa: 3.2,
    languageScores: [mockLanguageScores[0]],
    appliedUniversities: [
      { universityId: '3', rank: 1 },
      { universityId: '4', rank: 2 }
    ],
    editCount: 0,
    maxEditCount: 10,
    isDeadlineRestricted: false
  },
];

// 유틸리티 함수들
export function getUserById(id: string): User |  null {
  return mockUsers.find(user => user.id === id) || null;
}

export function getUserByUUID(uuid: string): User | undefined {
  return mockUsers.find(user => user.uuid === uuid);
}

export function getUniversityById(id: string): University | undefined {
  return mockUniversities.find(university => university.id === id);
}

export function getUniversityApplicants(universityId: string): User[] {
  return mockUsers.filter(user => 
    user.appliedUniversities.some(app => app.universityId === universityId)
  );
}

export function getUserApplications(userId: string): Array<University & { rank: number }> {
  const user = getUserById(userId);
  if (!user) return [];
  
  return user.appliedUniversities
    .map(app => {
      const university = getUniversityById(app.universityId);
      return university ? { ...university, rank: app.rank } : null;
    })
    .filter(Boolean) as Array<University & { rank: number }>;
}

// 특정 대학교의 지원자를 지망순위와 함께 가져오기
export function getUniversityApplicantsWithRank(universityId: string): Array<User & { rank: number }> {
  return mockUsers
    .filter(user => user.appliedUniversities.some(app => app.universityId === universityId))
    .map(user => {
      const application = user.appliedUniversities.find(app => app.universityId === universityId);
      return { ...user, rank: application?.rank || 0 };
    });
}

// 사용자 지원 대학교 업데이트 함수
export function updateUserApplications(userId: string, applications: AppliedUniversity[]): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return false;
  
  mockUsers[userIndex].appliedUniversities = [...applications];
  mockUsers[userIndex].editCount += 1;
  
  return true;
}

export const languageTestTypes: { value: LanguageTestType; label: string }[] = [
  { value: 'JLPT', label: 'JLPT' },
  { value: 'HSK', label: 'HSK' },
  { value: 'TOEIC', label: 'TOEIC' },
  { value: 'TOEFL_IBT', label: 'TOEFL IBT' },
  { value: 'TOEFL_ITP', label: 'TOEFL ITP' },
  { value: 'IELTS', label: 'IELTS' }
]; 