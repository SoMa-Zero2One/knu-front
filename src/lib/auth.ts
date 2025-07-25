import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload, UserRole } from '@/types';

// JWT 시크릿 키 (실제 환경에서는 환경 변수로 관리)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// JWT 토큰 만료 시간 (7일)
const JWT_EXPIRES_IN = '7d';

/**
 * UUID 생성
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * JWT 토큰 생성
 */
export function generateJWTToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * JWT 토큰 검증 및 디코딩
 */
export function verifyJWTToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT 토큰 검증 실패:', error);
    return null;
  }
}

/**
 * UUID로부터 JWT 토큰 생성 (Mock 구현)
 * 실제 환경에서는 백엔드에서 처리됩니다.
 */
export function convertUUIDToJWT(uuid: string): string | null {
  // Mock 데이터에서 해당 UUID를 가진 사용자 찾기
  const mockUsers = getMockUsers();
  const user = mockUsers.find(u => u.uuid === uuid);
  
  if (!user) {
    return null;
  }

  return generateJWTToken({
    userId: user.id,
    uuid: user.uuid,
    role: user.role,
  });
}

/**
 * Mock 사용자 데이터 (실제로는 데이터베이스에서 가져옴)
 */
function getMockUsers() {
  return [
    {
      id: '1',
      uuid: 'user-uuid-1',
      name: '김학생',
      role: 'user' as UserRole,
    },
    {
      id: '2',
      uuid: 'user-uuid-2',
      name: '이학생',
      role: 'user' as UserRole,
    },
    {
      id: '3',
      uuid: 'user-uuid-3',
      name: '박학생',
      role: 'user' as UserRole,
    },
    {
      id: '4',
      uuid: 'user-uuid-4',
      name: '최학생',
      role: 'user' as UserRole,
    },
    {
      id: '5',
      uuid: 'user-uuid-5',
      name: '정학생',
      role: 'user' as UserRole,
    },
    {
      id: '6',
      uuid: 'admin-uuid-1',
      name: '관리자',
      role: 'admin' as UserRole,
    },
  ];
} 