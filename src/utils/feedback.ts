import { useAnalytics } from '@/hooks/useAnalytics';

export const FEEDBACK_FORM_URL = 'https://forms.gle/jD29BxgSNBthL9Sz6';

export const createFeedbackHandler = (trackEvent: ReturnType<typeof useAnalytics>['trackEvent'], userNickname?: string) => {
  return () => {
    trackEvent(`피드백_클릭_${userNickname}`, 'feedback');
    window.open(FEEDBACK_FORM_URL, '_blank');
  };
};