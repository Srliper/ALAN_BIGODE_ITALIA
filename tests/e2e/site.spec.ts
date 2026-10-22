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

test('mostra o Instagram da barbearia e o perfil do dono', async ({ page }) => {
  await page.goto('/');
  const footerInstagram = page.locator('footer').getByRole('link', { name: 'Instagram' });
  await expect(footerInstagram).toHaveAttribute('href', 'https://www.instagram.com/barbearia_bigode_italia/');
  await expect(page.locator('#contact')).toContainText('@barbearia_bigode_italia');

  const team = page.locator('#team');
  await expect(team.getByRole('heading', { name: 'Alan Bedim' })).toBeVisible();
  await expect(team).toContainText('Dono');
  await expect(team.getByRole('link', { name: '@alan70bedim' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/alan70bedim/',
  );

  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld.sameAs).toEqual(['https://www.instagram.com/barbearia_bigode_italia/']);
});

test('loja: monta o pedido e envia pelo WhatsApp', async ({ page }) => {
  await captureWindowOpen(page);
  await page.goto('/');
  const shop = page.locator('#products');
  await expect(shop.getByRole('heading', { name: 'Pomada Matte' })).toBeVisible();
  // Produto escondido no painel não aparece; esgotado aparece sem botão
  await expect(shop.getByRole('heading', { name: 'Cera Rascunho' })).toHaveCount(0);
  await expect(shop.locator('article', { hasText: 'Gel Fixador' })).toContainText('Esgotado');

  const pomada = shop.locator('article', { hasText: 'Pomada Matte' });
  await pomada.getByRole('button', { name: 'Adicionar' }).click();
  await pomada.getByRole('button', { name: 'Aumentar Pomada Matte' }).click();
  await shop.locator('article', { hasText: 'Óleo para Barba' }).getByRole('button', { name: 'Adicionar' }).click();

  const cart = page.getByRole('region', { name: 'Seu pedido' });
  await expect(cart).toContainText('3 itens');
  await expect(cart).toContainText('129,90');
  await cart.getByRole('button', { name: 'Pedir' }).click();

  const [url] = await openedUrls(page);
  const message = decodeURIComponent(url.split('text=')[1]).replace(/\u00a0/g, ' ');
  expect(message).toContain('• 2x Pomada Matte — R$ 90,00');
  expect(message).toContain('• 1x Óleo para Barba — R$ 39,90');
  expect(message).toContain('*Total:* R$ 129,90');
  await expect(cart).toBeHidden();
});

test('atalhos dourados levam para as seções certas', async ({ page }) => {
  await page.goto('/');
  const quick = page.getByRole('region', { name: 'Atalhos' });
  await expect(quick.getByRole('link')).toHaveText([
    'Agendar',
    'Serviços',
    'Produtos',
    'Equipe',
    'WhatsApp',
    'Como chegar',
  ]);
  await expect(quick.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', /wa\.me\/5515999648684/);
  await expect(quick.getByRole('link', { name: 'Como chegar' })).toHaveAttribute('target', '_blank');
  await quick.getByRole('link', { name: 'Agendar' }).click();
  await expect(page).toHaveURL(/#booking$/);
});

test('topo usa o vídeo da barbearia, sem som e em loop', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('#home video');
  await expect(video).toHaveAttribute('poster', '/video/hero-capa.jpg');
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop && v.autoplay && v.playsInline)).toBe(true);
  for (const src of ['/video/hero.mp4', '/video/hero.webm', '/video/hero-capa.jpg']) {
    const res = await page.request.get(src);
    expect(res.ok()).toBe(true);
  }
});

test('com "reduzir movimento" no sistema, mostra só a imagem de capa', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await mockSupabase(context);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#home video')).toHaveCount(0);
  await expect(page.locator('#home img[src="/video/hero-capa.jpg"]')).toHaveCount(1);
  // A sequência vira imagem parada com as frases
  await expect(page.locator('#experience canvas')).toHaveCount(0);
  await expect(page.locator('#experience').getByRole('link', { name: 'Agendar agora' })).toBeVisible();
  await context.close();
});

test('sequência avança os quadros com a rolagem e termina no botão de agendar', async ({ page, isMobile }) => {
  await page.goto('/');
  const section = page.locator('#experience');
  await expect(section).toHaveAttribute('data-frame', '0');
  const top = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const height = await section.evaluate((el) => el.offsetHeight - window.innerHeight);

  await page.evaluate((y) => window.scrollTo(0, y), top + height / 2);
  await expect.poll(async () => Number(await section.getAttribute('data-frame'))).toBeGreaterThan(30);
  await expect(section.getByText('Cada detalhe pensado para você relaxar')).toBeVisible();

  await page.evaluate((y) => window.scrollTo(0, y), top + height);
  const last = isMobile ? '95' : '143';
  await expect(section).toHaveAttribute('data-frame', last);
  await expect(section.getByRole('link', { name: 'Agendar agora' })).toBeVisible();

  const set = isMobile ? 'celular' : 'desktop';
  expect((await page.request.get(`/sequencia/${set}/001.webp`)).ok()).toBe(true);
  expect((await page.request.get(`/sequencia/${set}/${isMobile ? '096' : '144'}.webp`)).ok()).toBe(true);
});

test('endereço inexistente mostra a página 404', async ({ page }) => {
  await page.goto('/pagina-que-nao-existe');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar para o início' }).click();
  await expect(page).toHaveURL('/');
});

test('sem a tabela de produtos, o resto do site continua vindo do painel', async ({ browser }) => {
  const context = await browser.newContext();
  await mockSupabase(context, { withoutProducts: true });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#services').getByRole('heading', { name: 'Coloração' })).toBeVisible();
  await expect(page.locator('#cutType option')).toContainText(['Low fade']);
  await expect(page.locator('#products')).toHaveCount(0);
  await context.close();
});
