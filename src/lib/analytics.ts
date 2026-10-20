import { track } from '@vercel/analytics';

// Eventos aparecem em Vercel → projeto → Analytics → Events (ative o Web Analytics no painel da Vercel).
export const trackEvent = (name: string, properties?: Record<string, string>) => {
  try {
    track(name, properties);
  } catch {
    // Analytics nunca deve quebrar o site
  }
};
