import { NextResponse } from 'next/server';
import { getTokenFromAPI } from '@/lib/auth';
import { getUserByUUID } from '@/data/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    if (!uuid) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 UUID입니다.' },
        { status: 400 }
      );
    }

    // 외부 API를 통해 JWT 토큰 획득
    const tokenResponse = await getTokenFromAPI(uuid);
    if (!tokenResponse) {
      return NextResponse.json(
        { success: false, error: '토큰 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 로컬에서 사용자 정보 조회 (선택사항)
    const user = getUserByUUID(uuid);

    return NextResponse.json({
      success: true,
      data: {
        access_token: tokenResponse.access_token,
        token_type: tokenResponse.token_type,
        user: user ? {
          id: user.id,
          name: user.name,
        } : null
      }
    });

  } catch (error) {
    console.error('JWT 토큰 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 