import type { BrowserContext, Route } from '@playwright/test';
import { SUPABASE_URL } from '../../playwright.config';

// Senha só dos testes. A senha real do painel fica apenas no Supabase, nunca no repositório.
export const ADMIN_PASSWORD = 'senha-de-teste';

type Row = Record<string, unknown> & { id: string | number; sort: number };

const seed = () => ({
  services: [
    {
      id: 'corte',
      name: 'Corte de Cabelo',
      description: 'Cortes modernos',
      price: 35,
      duration_minutes: 40,
      image_url: '',
      badge: null,
      active: true,
      sort: 0,
    },
    {
      id: 'coloracao',
      name: 'Coloração',
      description: 'Cores e luzes',
      price: 80,
      duration_minutes: 90,
      image_url: '',
      badge: null,
      active: true,
      sort: 1,
    },
    {
      id: 'manutencao-semanal',
      name: 'Manutenção Semanal',
      description: 'Toda semana',
      price: 20,
      duration_minutes: 20,
      image_url: '',
      badge: 'Semanal',
      active: true,
      sort: 2,
    },
  ] as Row[],
  cut_types: [
    { id: 1, name: 'Low fade', sort: 0 },
    { id: 2, name: 'Navalhado', sort: 1 },
  ] as Row[],
  team: [
    {
      id: 1,
      name: 'Alan Bedim',
      role: 'Dono',
      bio: 'Fundador e dono da Barbearia Italia.',
      instagram: 'https://www.instagram.com/alan70bedim/',
      photo_url: '',
      storage_path: null,
      sort: 0,
    },
  ] as Row[],
  gallery: [
    { id: 1, title: 'Corte do dia', image_url: `${SUPABASE_URL}/foto-inicial.png`, storage_path: null, sort: 0 },
  ] as Row[],
});

// 1x1 px PNG, usado como resposta para qualquer imagem
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const filterValue = (params: URLSearchParams, key: string) => params.get(key)?.replace(/^eq\./, '');

const matches = (row: Row, params: URLSearchParams) => {
  const id = filterValue(params, 'id');
  const active = filterValue(params, 'active');
  return (id === undefined || String(row.id) === id) && (active === undefined || String(row.active) === active);
};

/**
 * Simula o Supabase (login, tabelas e upload de fotos) para todas as abas do contexto,
 * com um banco em memória compartilhado — o que o painel salva aparece no site.
 */
export async function mockSupabase(context: BrowserContext) {
  const db = seed();
  let nextId = 100;
  const uploads: string[] = [];

  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

  // Sem internet nos testes: imagens externas, fontes e mapa recebem respostas vazias
  await context.route(/images\.unsplash\.com|fonts\.(googleapis|gstatic)\.com|google\.com\/maps/, (route) =>
    route.request().resourceType() === 'image'
      ? route.fulfill({ contentType: 'image/png', body: PIXEL })
      : route.fulfill({ body: '' }),
  );

  await context.route(`${SUPABASE_URL}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;

    if (path.startsWith('/auth/v1/token')) {
      const body = req.postDataJSON();
      if (body.password !== ADMIN_PASSWORD) {
        return json(route, { error: 'invalid_grant', error_description: 'Invalid login credentials' }, 400);
      }
      return json(route, {
        access_token: 'token-de-teste',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'refresh-de-teste',
        user: {
          id: 'dono',
          aud: 'authenticated',
          role: 'authenticated',
          email: body.email,
          app_metadata: {},
          user_metadata: {},
        },
      });
    }
    if (path.startsWith('/auth/v1/logout')) return route.fulfill({ status: 204 });

    if (path.startsWith('/storage/v1/object/')) {
      if (req.method() === 'GET' || path.includes('/public/'))
        return route.fulfill({ contentType: 'image/png', body: PIXEL });
      uploads.push(path);
      return json(route, { Key: path.replace('/storage/v1/object/', '') });
    }
    if (path === '/foto-inicial.png') return route.fulfill({ contentType: 'image/png', body: PIXEL });

    const table = path.replace('/rest/v1/', '') as keyof typeof db;
    const rows = db[table];
    if (!rows) return json(route, { message: 'tabela desconhecida' }, 404);
    const params = url.searchParams;

    switch (req.method()) {
      case 'GET':
        return json(
          route,
          rows.filter((r) => matches(r, params)).sort((a, b) => a.sort - b.sort),
        );
      case 'POST': {
        const body = req.postDataJSON();
        for (const item of Array.isArray(body) ? body : [body]) {
          const index = rows.findIndex((r) => item.id !== undefined && r.id === item.id);
          if (index >= 0) rows[index] = { ...rows[index], ...item };
          else rows.push({ id: nextId++, ...item });
        }
        return route.fulfill({ status: 201 });
      }
      case 'PATCH':
        rows.filter((r) => matches(r, params)).forEach((r) => Object.assign(r, req.postDataJSON()));
        return route.fulfill({ status: 204 });
      case 'DELETE':
        db[table] = rows.filter((r) => !matches(r, params));
        return route.fulfill({ status: 204 });
      default:
        return route.fulfill({ status: 405 });
    }
  });

  return { db, uploads };
}

export { PIXEL };
