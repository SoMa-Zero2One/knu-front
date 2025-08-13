'use client';

import { useCallback } from 'react';
import { event } from '@/lib/gtag';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    // user.nickname이 '닉네임'이면 추적하지 않음
    if (user?.nickname === '닉네임') {
      return;
    }

    event(action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }, [user?.nickname]);

  return {
    trackEvent,
  };
};