'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

interface BottomNavigationProps {
  onBackClick?: () => void;
  backUrl?: string;
}

export default function BottomNavigation({ onBackClick, backUrl }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  const handleProfileClick = () => {
    if (user) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleFeedbackClick = () => {
    trackEvent(`피드백_클릭_${user?.nickname}`, 'feedback');
    window.open('https://forms.gle/jD29BxgSNBthL9Sz6', '_blank');
  };

  const isHomePage = pathname === '/dashboard';
  const isMyProfilePage = pathname === `/profile/${user?.id}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* 뒤로가기 */}
        <button
          onClick={handleBackClick}
          className="flex flex-col items-center justify-center p-2 text-black hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs mt-1">뒤로</span>
        </button>

        {/* 홈 */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center p-2 ${
            isHomePage ? 'text-blue-600' : 'text-black hover:text-gray-700'
          }`}
        >
          <svg className="w-6 h-6" fill={isHomePage ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">홈</span>
        </button>

        {/* 내 프로필 */}
        {user && (
          <button
            onClick={handleProfileClick}
            className={`flex flex-col items-center justify-center p-2 ${
              isMyProfilePage ? 'text-blue-600' : 'text-black hover:text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill={isMyProfilePage ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">내 프로필</span>
          </button>
        )}

        {/* 피드백 */}
        <button
          onClick={handleFeedbackClick}
          className="flex flex-col items-center justify-center p-2 text-black hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs mt-1">피드백</span>
        </button>
      </div>
    </nav>
  );
}