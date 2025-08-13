import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { universitiesAPI } from '@/api';
import UniversityPageClient from './UniversityPageClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // 쿠키의 토큰을 사용해서 API 호출 (API 함수 수정 필요)
    const university = await universitiesAPI.getUniversityByIdWithToken(resolvedParams.id, token);
    
    return {
      title: `${university.name} - 교환학생 경쟁률`,
      description: `${university.name} 교환학생 지원현황 및 경쟁률을 확인하세요. 현재 지원자 ${university.applicants?.length || 0}명, 모집인원 ${university.slot}명`,
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: '대학교 상세 정보 - 교환학생 경쟁률',
      description: '교환학생 지원현황 및 경쟁률을 확인하세요.',
    };
  }
}

interface UniversityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityPage({ params }: UniversityPageProps) {
  return <UniversityPageClient params={params} />;
}