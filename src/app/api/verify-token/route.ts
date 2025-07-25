import { NextResponse } from 'next/server';
import { verifyJWTToken } from '@/lib/auth';
import { getUserById } from '@/data/mockData';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: '토큰이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // JWT 토큰 검증
    const payload = verifyJWTToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const user = getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 