import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { usersAPI } from '@/api';
import ProfilePageClient from './ProfilePageClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const userData = await usersAPI.getUserByIdWithToken(resolvedParams.id, token);
    
    return {
      title: `${userData.nickname}님의 프로필 - 교환학생 경쟁률`,
      description: `${userData.nickname}님의 교환학생 지원 현황과 성적 정보를 확인하세요. 지원 대학교 ${userData.applications?.length || 0}개`,
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: '사용자 프로필 - 교환학생 경쟁률',
      description: '사용자의 교환학생 지원 현황과 성적 정보를 확인하세요.',
    };
  }
}

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfilePageClient params={params} />;
}