'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Twemoji from 'react-twemoji';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backButtonText?: string;
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
  backButtonText = "← 뒤로가기",
  onBackClick,
  backUrl,
  universityFlag,
  universityName,
  hideProfileButton = false,
  showHomeButton = false,
}: HeaderProps) {
  const router = useRouter();
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
          {user && !hideProfileButton && (
            <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="hidden sm:block text-xs sm:text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              내 프로필
            </button>
          )}
        </div>
      </div>
    </header>
  );
}