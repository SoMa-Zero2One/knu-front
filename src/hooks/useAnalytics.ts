'use client';

import { event } from '@/lib/gtag';

export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    console.log('GA Event:', { action, category, label, value });
    event(action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };

  const trackButtonClick = (buttonName: string, eventName?: string) => {
    trackEvent(eventName || 'click', 'button', buttonName, 1);
  };

  const trackNavigation = (from: string, to: string) => {
    trackEvent('navigate', 'navigation', `${from} -> ${to}`, 1);
  };

  const trackFormSubmit = (formName: string) => {
    trackEvent('submit', 'form', formName, 1);
  };

  return {
    trackEvent,
    trackButtonClick,
    trackNavigation,
    trackFormSubmit,
  };
};