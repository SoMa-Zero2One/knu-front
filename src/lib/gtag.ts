declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const GA_TRACKING_ID = 'G-K5JY00NCLL';

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (action: string, { event_category, event_label, value, ...parameters }: {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}) => {
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    ...parameters,
  });
};