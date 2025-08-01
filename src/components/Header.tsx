'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Twemoji from 'react-twemoji';

interface HeaderProps {
  title: string;
  backButtonText?: string;
  onBackClick?: () => void;
  backUrl?: string;
  universityFlag?: string;
  universityName?: string;
}

export default function Header({ 
  title, 
  backButtonText = "← 뒤로가기",
  onBackClick,
  backUrl,
  universityFlag,
  universityName,
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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
              <>
              <button
                onClick={handleBackClick}
                className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer hidden sm:block"
              >
                {backButtonText}
              </button>
              <button
                onClick={handleBackClick}
                className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer block sm:hidden"
              >
                ←
              </button>
              </>
              <div className="flex items-center">
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
          {user &&

          <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              내 프로필
            </button>
            }
        </div>
      </div>
    </header>
  );
}