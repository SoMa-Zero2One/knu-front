import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/types';

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
 * 외부 API를 통해 UUID로부터 JWT 토큰 획득
 */
export async function getTokenFromAPI(uuid: string): Promise<{ access_token: string; token_type: string } | null> {
  try {
    const response = await fetch('https://api.knu.soma.wibaek.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid }),
    });

    if (!response.ok) {
      console.error('토큰 API 요청 실패:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('토큰 API 호출 오류:', error);
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
    },
    {
      id: '2',
      uuid: 'user-uuid-2',
      name: '이학생',
    },
    {
      id: '3',
      uuid: 'user-uuid-3',
      name: '박학생',
    },
    {
      id: '4',
      uuid: 'user-uuid-4',
      name: '최학생',
    },
    {
      id: '5',
      uuid: 'user-uuid-5',
      name: '정학생',
    },
    {
      id: '6',
      uuid: 'admin-uuid-1',
      name: '관리자',
    },
  ];
} 