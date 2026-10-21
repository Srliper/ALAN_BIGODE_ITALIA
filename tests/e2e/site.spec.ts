import { expect, test } from '@playwright/test';
import { mockSupabase } from './mock-supabase';
import { captureWindowOpen, nextWeekday, openedUrls, timeOptions } from './helpers';

test.beforeEach(async ({ context }) => {
  await mockSupabase(context);
});

test('mostra serviços, preços e tipos de corte vindos do painel', async ({ page }) => {
  await page.goto('/');
  const services = page.locator('#services');
  await expect(services.getByRole('heading', { name: 'Corte de Cabelo' })).toBeVisible();
  await expect(services).toContainText('R$ 35,00');
  await expect(services).toContainText('1h30');
  await expect(page.locator('#cutType option')).toContainText(['Selecione o tipo de corte', 'Low fade', 'Navalhado']);

  // Dados para o Google atualizados com os preços do painel
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld!).priceRange).toBe('R$ 20 - R$ 80');
});

test('horários respeitam a duração do serviço e o fechamento', async ({ page }) => {
  await page.goto('/');
  await page.fill('#date', nextWeekday(6));
  await page.selectOption('#service', 'corte');
  expect((await timeOptions(page)).at(-1)).toBe('20:00');

  await page.selectOption('#time', '20:00');
  await page.selectOption('#service', 'coloracao');
  expect((await timeOptions(page)).at(-1)).toBe('19:30');
  // O horário que não cabe mais é limpo
  await expect(page.locator('#time')).toHaveValue('');
});

test('avisa quando a barbearia está fechada', async ({ page }) => {
  await page.goto('/');
  await page.fill('#date', nextWeekday(1));
  await expect(page.locator('#date-help')).toContainText('Fechado neste dia (domingo e segunda)');
  await expect(page.locator('#time')).toBeDisabled();
});

test('agendamento abre o WhatsApp com a mensagem pronta', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/');
  await page.fill('#name', 'João da Silva');
  await page.fill('#phone', '15999998888');
  await expect(page.locator('#phone')).toHaveValue('(15) 99999-8888');
  await page.selectOption('#service', 'manutencao-semanal');
  await page.selectOption('#cutType', 'Low fade');
  await page.fill('#date', nextWeekday(3));
  await page.selectOption('#time', '10:00');
  await page.getByRole('button', { name: 'Confirmar pelo WhatsApp' }).click();

  const [url] = await openedUrls(page);
  expect(url).toContain('https://wa.me/5515999648684?text=');
  // toLocaleString usa espaço não separável em "R$ 20,00"
  const message = decodeURIComponent(url.split('text=')[1]).replace(/\u00a0/g, ' ');
  expect(message).toContain('*Nome:* João da Silva');
  expect(message).toContain('*Serviço:* Manutenção Semanal (R$ 20,00)');
  expect(message).toContain('*Tipo de corte:* Low fade');
  expect(message).toContain('*Horário:* 10:00');
  expect(message).toContain('*Frequência:* toda semana');
  await expect(page.getByText('Quase lá!')).toBeVisible();
});

test('não envia com campos obrigatórios vazios', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Confirmar pelo WhatsApp' }).click();
  await expect(page.getByText('Campos obrigatórios', { exact: true })).toBeVisible();
  expect(await openedUrls(page)).toHaveLength(0);
});

test('botão Agendar do serviço pré-seleciona no formulário', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#services article', { hasText: 'Coloração' });
  await card.getByRole('link', { name: 'Agendar' }).click();
  await expect(page.locator('#service')).toHaveValue('coloracao');
});

test('galeria amplia a foto e prende o foco do teclado', async ({ page, isMobile }) => {
  test.skip(isMobile, 'navegação por teclado');
  await page.goto('/');
  await page.getByRole('button', { name: 'Ampliar foto: Corte do dia' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fechar' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Próxima foto' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Ampliar foto: Corte do dia' })).toBeFocused();
});

test('endereço inexistente mostra a página 404', async ({ page }) => {
  await page.goto('/pagina-que-nao-existe');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar para o início' }).click();
  await expect(page).toHaveURL('/');
});
