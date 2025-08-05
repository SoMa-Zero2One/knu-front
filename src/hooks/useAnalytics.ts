'use client';

import { event } from '@/lib/gtag';

export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    event(action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };

  const trackButtonClick = (buttonName: string, eventName?: string) => {
    trackEvent(eventName || 'click', 'button', buttonName, 1);
  };

  const trackNavigation = (label: string, eventName?: string) => {
    trackEvent(eventName || 'navigate', 'navigation', label, 1);
  };

  const trackFormSubmit = (label: string, eventName?: string) => {
    trackEvent(eventName || 'submit', 'form', label, 1);
  };

  return {
    trackEvent,
    trackButtonClick,
    trackNavigation,
    trackFormSubmit,
  };
};