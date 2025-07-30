import { NextResponse } from 'next/server';
import { convertUUIDToJWT } from '@/lib/auth';
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

    // UUID로 사용자 확인
    const user = getUserByUUID(uuid);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // JWT 토큰 생성
    const token = convertUUIDToJWT(uuid);
    if (!token) {
      return NextResponse.json(
        { success: false, error: '토큰 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
        }
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