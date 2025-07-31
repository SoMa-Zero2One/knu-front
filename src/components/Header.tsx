'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  backUrl?: string;
  leftContent?: React.ReactNode;
}

export default function Header({ 
  title, 
  showBackButton = false, 
  backButtonText = "← 뒤로가기",
  onBackClick,
  backUrl,
  leftContent 
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
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {backButtonText}
              </button>
            )}
            {leftContent || (
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
            )}
          </div>
          {user &&

          <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer hidden sm:block"
            >
              {user.name}님 프로필
            </button>}
        </div>
      </div>
    </header>
  );
}