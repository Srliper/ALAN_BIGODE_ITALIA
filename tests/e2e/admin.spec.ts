import { expect, test, type Page } from '@playwright/test';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PIXEL, mockSupabase } from './mock-supabase';

const login = async (page: Page, password = ADMIN_PASSWORD, user = ADMIN_LOGIN) => {
  await page.goto('/admin');
  await page.getByLabel('Usuário').fill(user);
  await page.getByLabel('Senha').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
};

let db: Awaited<ReturnType<typeof mockSupabase>>['db'];
let uploads: string[];

test.beforeEach(async ({ context }) => {
  ({ db, uploads } = await mockSupabase(context));
});

test('pede usuário e senha e recusa dados errados', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Entrar no painel' })).toBeVisible();
  await expect(page.getByLabel('Usuário')).toHaveAttribute('placeholder', '@usuario');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

  await login(page, 'senha-errada');
  await expect(page.getByText('Usuário ou senha incorretos.')).toBeVisible();
  await login(page, ADMIN_PASSWORD, '@outro');
  await expect(page.getByText('Usuário ou senha incorretos.').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Painel da barbearia' })).toHaveCount(0);
});

test('aceita o usuário com ou sem @ e com maiúsculas', async ({ page }) => {
  await login(page, ADMIN_PASSWORD, ' AlanBigode ');
  await expect(page.getByRole('heading', { name: 'Painel da barbearia' })).toBeVisible();
});

test('entra com @alanbigode e a senha, abre o tutorial na primeira vez e sai', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('heading', { name: 'Painel da barbearia' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Como usar' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Alterar preços e serviços')).toBeVisible();

  // Links do tutorial levam para a aba certa
  await page.getByRole('button', { name: 'Galeria', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Galeria' })).toHaveAttribute('aria-selected', 'true');

  // Da segunda vez, abre direto nos serviços
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Serviços e preços' })).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('heading', { name: 'Entrar no painel' })).toBeVisible();
});

test('alterar preço e esconder serviço aparece no site', async ({ page, context }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Serviços e preços' }).click();

  await page.locator('#price-corte').fill('42.5');
  await page.locator('#duration-corte').fill('50');
  await page.locator('#badge-corte').fill('Promoção');
  const card = page
    .locator('div', { has: page.locator('#price-corte') })
    .filter({ has: page.getByRole('button', { name: 'Salvar' }) })
    .last();
  await card.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Serviço salvo')).toBeVisible();
  expect(db.services.find((s) => s.id === 'corte')).toMatchObject({
    price: 42.5,
    duration_minutes: 50,
    badge: 'Promoção',
  });
  await expect(card.getByRole('button', { name: 'Salvar' })).toBeDisabled();

  const coloracao = page
    .locator('div', { has: page.locator('#price-coloracao') })
    .filter({ has: page.getByRole('button', { name: 'Salvar' }) })
    .last();
  await coloracao.getByLabel('Mostrar no site').uncheck();
  await coloracao.getByRole('button', { name: 'Salvar' }).click();
  await expect.poll(() => db.services.find((s) => s.id === 'coloracao')?.active).toBe(false);

  const site = await context.newPage();
  await site.goto('/');
  const services = site.locator('#services');
  await expect(services).toContainText('R$ 42,50');
  await expect(services).toContainText('Promoção');
  await expect(services).toContainText('50 min');
  await expect(services.getByRole('heading', { name: 'Coloração' })).toHaveCount(0);
});

test('adicionar serviço novo com foto', async ({ page, context }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Serviços e preços' }).click();
  await page.getByRole('button', { name: 'Adicionar serviço' }).click();

  const novo = page.locator('[id^="name-servico-"]');
  const id = (await novo.getAttribute('id'))!.replace('name-', '');
  await novo.fill('Pigmentação de Barba');
  await page.locator(`#price-${id}`).fill('30');
  await page.locator(`#duration-${id}`).fill('25');
  await page.locator(`#description-${id}`).fill('Barba mais cheia e alinhada');
  await page
    .locator('input[type=file]')
    .last()
    .setInputFiles({ name: 'barba.png', mimeType: 'image/png', buffer: PIXEL });
  await expect(page.getByText('Foto enviada')).toBeVisible();
  await page.getByRole('button', { name: 'Salvar' }).last().click();
  await expect(page.getByText('Serviço salvo')).toBeVisible();
  expect(uploads.some((u) => u.includes('/fotos/servicos/'))).toBe(true);

  const site = await context.newPage();
  await site.goto('/');
  await expect(site.locator('#services').getByRole('heading', { name: 'Pigmentação de Barba' })).toBeVisible();
  await expect(site.locator('#service option', { hasText: 'Pigmentação de Barba' })).toHaveCount(1);
});

test('não salva serviço sem preço', async ({ page }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Serviços e preços' }).click();
  await page.getByRole('button', { name: 'Adicionar serviço' }).click();
  await page.locator('[id^="name-servico-"]').fill('Sem preço');
  await page.getByRole('button', { name: 'Salvar' }).last().click();
  await expect(page.getByText('Preencha nome, preço e duração')).toBeVisible();
  expect(db.services).toHaveLength(3);
});

test('gerenciar tipos de corte', async ({ page, context }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Tipos de corte' }).click();

  await page.getByPlaceholder('Novo tipo de corte').fill('Mid fade com risco');
  await page.getByRole('button', { name: 'Adicionar' }).click();
  await expect(page.getByText('Tipo de corte adicionado')).toBeVisible();

  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Remover Navalhado' }).click();
  await expect(page.getByRole('button', { name: 'Remover Navalhado' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Mover para cima' }).last().click();
  await expect(page.getByLabel('Nome do tipo de corte').first()).toHaveValue('Mid fade com risco');

  const site = await context.newPage();
  await site.goto('/');
  await expect(site.locator('#cutType option')).toHaveText([
    'Selecione o tipo de corte',
    'Mid fade com risco',
    'Low fade',
  ]);
});

test('enviar e excluir fotos da galeria', async ({ page, context }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Galeria' }).click();

  await page.getByPlaceholder('Título da foto (opcional)').fill('Low fade com risco');
  await page.locator('input[type=file]').setInputFiles([
    { name: 'corte1.png', mimeType: 'image/png', buffer: PIXEL },
    { name: 'corte2.png', mimeType: 'image/png', buffer: PIXEL },
  ]);
  await expect(page.getByText('Fotos adicionadas')).toBeVisible();
  await expect(page.getByLabel('Título da foto')).toHaveCount(3);
  expect(uploads.filter((u) => u.includes('/fotos/galeria/'))).toHaveLength(2);

  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Excluir foto' }).first().click();
  await expect(page.getByText('Foto excluída')).toBeVisible();
  await expect(page.getByLabel('Título da foto')).toHaveCount(2);

  const site = await context.newPage();
  await site.goto('/');
  await expect(site.getByRole('button', { name: 'Ampliar foto: Low fade com risco' })).toHaveCount(2);
  await expect(site.getByRole('button', { name: 'Ampliar foto: Corte do dia' })).toHaveCount(0);
});

test('mostra o perfil do dono e edita a equipe', async ({ page, context }) => {
  await login(page);
  await expect(page.getByText('Olá, Alan!')).toBeVisible();
  await expect(page.getByRole('link', { name: '@alan70bedim' }).first()).toBeVisible();

  await page.getByRole('tab', { name: 'Equipe' }).click();
  await expect(page.locator('#team-name-1')).toHaveValue('Alan Bedim');
  await page.locator('#team-bio-1').fill('Barbeiro há 20 anos, especialista em barba.');
  await page
    .locator('input[type=file]')
    .first()
    .setInputFiles({ name: 'alan.png', mimeType: 'image/png', buffer: PIXEL });
  await expect(page.getByText('Foto enviada')).toBeVisible();
  await page.getByRole('button', { name: 'Salvar' }).first().click();
  await expect.poll(() => db.team[0].bio).toBe('Barbeiro há 20 anos, especialista em barba.');
  expect(db.team[0].photo_url).toContain('/fotos/equipe/');

  // Novo barbeiro com Instagram digitado só como @usuario
  await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
  await page.locator('#team-name-novo').fill('Carlos Souza');
  await page.locator('#team-instagram-novo').fill('@carlos.barber');
  await page.getByRole('button', { name: 'Salvar' }).last().click();
  await expect.poll(() => db.team.length).toBe(2);
  expect(db.team[1]).toMatchObject({ role: 'Barbeiro', instagram: 'https://www.instagram.com/carlos.barber/' });

  const site = await context.newPage();
  await site.goto('/');
  const team = site.locator('#team');
  await expect(team).toContainText('Barbeiro há 20 anos');
  await expect(team.getByRole('img', { name: 'Alan Bedim' })).toBeVisible();
  await expect(team.getByRole('link', { name: '@carlos.barber' })).toBeVisible();
});

test('produtos: rascunho sem preço não vai ao site; com preço aparece', async ({ page, context }) => {
  await login(page);
  await page.getByRole('tab', { name: 'Produtos' }).click();
  await expect(page.locator('#product-name-rascunho')).toHaveValue('Cera Rascunho');

  const card = page
    .locator('div', { has: page.locator('#product-name-rascunho') })
    .filter({ has: page.getByRole('button', { name: 'Salvar' }) })
    .last();
  await card.getByLabel('Mostrar no site').check();
  await card.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Defina o preço antes de mostrar no site')).toBeVisible();
  expect(db.products.find((p) => p.id === 'rascunho')?.active).toBe(false);

  await page.locator('#product-price-rascunho').fill('32');
  await page
    .locator('input[type=file]')
    .nth(3)
    .setInputFiles({ name: 'cera.png', mimeType: 'image/png', buffer: PIXEL });
  await expect(page.getByText('Foto enviada')).toBeVisible();
  await card.getByRole('button', { name: 'Salvar' }).click();
  await expect.poll(() => db.products.find((p) => p.id === 'rascunho')?.active).toBe(true);
  expect(db.products.find((p) => p.id === 'rascunho')).toMatchObject({ price: 32 });
  expect(uploads.some((u) => u.includes('/fotos/produtos/'))).toBe(true);

  // Marca a pomada como esgotada
  const pomada = page
    .locator('div', { has: page.locator('#product-name-pomada-matte') })
    .filter({ has: page.getByRole('button', { name: 'Salvar' }) })
    .last();
  await pomada.getByLabel('Tem em estoque').uncheck();
  await pomada.getByRole('button', { name: 'Salvar' }).click();
  await expect.poll(() => db.products.find((p) => p.id === 'pomada-matte')?.in_stock).toBe(false);

  const site = await context.newPage();
  await site.goto('/');
  const shop = site.locator('#products');
  await expect(shop.getByRole('heading', { name: 'Cera Rascunho' })).toBeVisible();
  await expect(shop).toContainText('R$ 32,00');
  await expect(shop.locator('article', { hasText: 'Pomada Matte' })).toContainText('Esgotado');
});
