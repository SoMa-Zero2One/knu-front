'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import Twemoji from 'react-twemoji';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backUrl?: string;
  universityFlag?: string;
  universityName?: string;
  hideProfileButton?: boolean;
  showHomeButton?: boolean;
}

export default function Header({ 
  title, 
  showBackButton = false,
  onBackClick,
  backUrl,
  universityFlag,
  universityName,
  hideProfileButton = false,
  showHomeButton = false,
}: HeaderProps) {
  const router = useRouter();
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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="hidden sm:flex items-center">
              {showBackButton && (
                <button
                  onClick={handleBackClick}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  뒤로 가기
                </button>
              )}
              
              {showBackButton && showHomeButton && (
                <span className="mx-2 text-gray-300">|</span>
              )}
              
              {showHomeButton && (
                <button
                  onClick={handleHomeClick}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  메인으로
                </button>
              )}
            </div>
            
            <div className="flex items-center ml-4">
                {universityFlag && universityName ? (
                  <>
                    <Twemoji options={{ className: 'twemoji mr-3' }}>
                      <span>{universityFlag}</span>
                    </Twemoji>
                    <h1 className='lg:text-xl font-semibold text-gray-900'>
                      {universityName}
                    </h1>
                  </>
                ) : (
                  <h1 className='lg:text-xl font-semibold text-gray-900'>
                    {title}
                  </h1>
                )}
              </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => {
                trackEvent(`피드백_클릭_${user?.nickname}`, 'feedback');
                window.open('https://forms.gle/jD29BxgSNBthL9Sz6', '_blank');
              }}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 cursor-pointer flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              피드백
            </button>
            {user && !hideProfileButton && (
              <button
                onClick={() => router.push(`/profile/${user.id}`)}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {user.nickname}님 프로필
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}