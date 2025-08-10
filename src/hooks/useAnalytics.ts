'use client';

import { useCallback } from 'react';
import { event } from '@/lib/gtag';

export const useAnalytics = () => {
  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    event(action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }, []); // 의존성이 없으므로 빈 배열

  return {
    trackEvent,
  };
};