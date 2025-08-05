import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const createNavigationHandlers = (router: AppRouterInstance) => {
  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  const handleProfileClick = (userId?: string) => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  const handleBackClick = (onBackClick?: () => void, backUrl?: string) => {
    if (onBackClick) {
      onBackClick();
    } else if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return {
    handleHomeClick,
    handleProfileClick,
    handleBackClick,
  };
};