'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavigationProps {
  onBackClick?: () => void;
  backUrl?: string;
}

export default function BottomNavigation({ onBackClick, backUrl }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

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

  const isHomePage = pathname === '/dashboard';
  const isProfilePage = pathname?.includes('/profile/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* 뒤로가기 */}
        <button
          onClick={handleBackClick}
          className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-gray-700"
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
            isHomePage ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
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
              isProfilePage ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill={isProfilePage ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">프로필</span>
          </button>
        )}
      </div>
    </nav>
  );
}