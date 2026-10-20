import type { SupabaseClient } from '@supabase/supabase-js';

// Preenchidas nas variáveis de ambiente da Vercel (veja ADMIN.md). Sem elas, o site usa os dados padrão.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const PHOTOS_BUCKET = 'fotos';

// Leitura pública via REST, sem carregar a biblioteca do Supabase para os visitantes
export async function fetchRows<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey}` },
  });
  if (!res.ok) throw new Error(`Falha ao carregar ${table}: ${res.status}`);
  return res.json();
}

let client: SupabaseClient | null = null;

// Cliente completo (login, gravação e upload) — usado só no painel admin
export async function getSupabase() {
  if (!client) {
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(url!, anonKey!);
  }
  return client;
}

export interface ServiceRow {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  badge: string | null;
  active: boolean;
  sort: number;
}

export interface CutTypeRow {
  id: number;
  name: string;
  sort: number;
}

export interface GalleryRow {
  id: number;
  title: string;
  image_url: string;
  storage_path: string | null;
  sort: number;
}
