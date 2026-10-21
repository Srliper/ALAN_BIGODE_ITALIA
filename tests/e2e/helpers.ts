import type { Page } from '@playwright/test';

// Próximo dia da semana (0 = domingo ... 6 = sábado) no formato do input de data
export const nextWeekday = (weekday: number) => {
  const d = new Date();
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7 || 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Guarda os links abertos com window.open (o WhatsApp) em vez de abrir outra aba
export const captureWindowOpen = (page: Page) =>
  page.addInitScript(() => {
    const opened: string[] = [];
    (window as unknown as { __opened: string[] }).__opened = opened;
    window.open = (url?: string | URL) => {
      opened.push(String(url));
      return null;
    };
  });

export const openedUrls = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

export const timeOptions = (page: Page) =>
  page
    .locator('#time option:not([disabled])')
    .evaluateAll((options) => options.map((o) => (o as HTMLOptionElement).value));
