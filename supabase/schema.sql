-- Painel admin da Barbearia Italia — rode este arquivo inteiro (pode rodar de novo sem problema) no Supabase (SQL Editor → New query → Run).
-- Cria as tabelas, as permissões (qualquer um lê, só quem está logado altera), o bucket de fotos
-- e preenche com os dados atuais do site.

create table if not exists public.services (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes int not null default 30 check (duration_minutes > 0),
  image_url text not null default '',
  badge text,
  active boolean not null default true,
  sort int not null default 0
);

create table if not exists public.cut_types (
  id bigint generated always as identity primary key,
  name text not null,
  sort int not null default 0
);

create table if not exists public.gallery (
  id bigint generated always as identity primary key,
  title text not null default '',
  image_url text not null,
  storage_path text,
  sort int not null default 0
);

alter table public.services enable row level security;
alter table public.cut_types enable row level security;
alter table public.gallery enable row level security;

-- Leitura pública (o site) e escrita só para usuários logados (o painel).
-- IMPORTANTE: desative o cadastro público em Authentication → Sign In / Providers → "Allow new users to sign up".
drop policy if exists "leitura publica" on public.services;
create policy "leitura publica" on public.services for select using (true);
drop policy if exists "admin altera" on public.services;
create policy "admin altera" on public.services for all to authenticated using (true) with check (true);
drop policy if exists "leitura publica" on public.cut_types;
create policy "leitura publica" on public.cut_types for select using (true);
drop policy if exists "admin altera" on public.cut_types;
create policy "admin altera" on public.cut_types for all to authenticated using (true) with check (true);
drop policy if exists "leitura publica" on public.gallery;
create policy "leitura publica" on public.gallery for select using (true);
drop policy if exists "admin altera" on public.gallery;
create policy "admin altera" on public.gallery for all to authenticated using (true) with check (true);

-- Bucket público para as fotos (serviços e galeria)
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
drop policy if exists "admin envia fotos" on storage.objects;
create policy "admin envia fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos');
drop policy if exists "admin altera fotos" on storage.objects;
create policy "admin altera fotos" on storage.objects for update to authenticated using (bucket_id = 'fotos');
drop policy if exists "admin apaga fotos" on storage.objects;
create policy "admin apaga fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos');

-- Dados iniciais (os mesmos que o site mostra hoje)
insert into public.services (id, name, description, price, duration_minutes, image_url, badge, sort) values
  ('corte', 'Corte de Cabelo', 'Cortes modernos e clássicos para todos os estilos', 35, 40, 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop', null, 0),
  ('barba', 'Barba', 'Design e acabamento profissional com toalha quente', 25, 30, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop', null, 1),
  ('corte-barba', 'Corte + Barba', 'Pacote completo de estilo — o favorito da casa', 50, 70, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop', null, 2),
  ('fade', 'Fade', 'O corte mais pedido do momento, com degradê perfeito', 40, 45, 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop', null, 3),
  ('coloracao', 'Coloração', 'Transforme seu visual com cores e luzes', 80, 90, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop', null, 4),
  ('tratamento', 'Tratamento Capilar', 'Hidratação, nutrição e reconstrução profissional', 45, 40, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop', null, 5),
  ('manutencao-semanal', 'Manutenção Semanal', 'Acabamento toda semana: pezinho, contorno e barba alinhada para o corte sempre em dia', 20, 20, 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop', 'Semanal', 6)
on conflict (id) do nothing;

insert into public.cut_types (name, sort)
select name, sort from (values
  ('Manter o corte atual', 0),
  ('Social', 1),
  ('Clássico (tesoura)', 2),
  ('Degradê', 3),
  ('Low fade', 4),
  ('Mid fade', 5),
  ('High fade', 6),
  ('Taper fade', 7),
  ('Navalhado', 8),
  ('Undercut', 9),
  ('Moicano', 10),
  ('Militar', 11),
  ('Máquina (buzz cut)', 12),
  ('Raspado', 13),
  ('Topete / Pompadour', 14),
  ('Crop (franja)', 15),
  ('Mullet', 16),
  ('Cacheado / Crespo', 17),
  ('Infantil', 18),
  ('Desenho / Risco (freestyle)', 19),
  ('Outro (descrever nas observações)', 20)
) as v(name, sort)
where not exists (select 1 from public.cut_types);

insert into public.gallery (title, image_url, sort)
select title, image_url, sort from (values
  ('Fade Moderno', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=75', 0),
  ('Barba Estilizada', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=75', 1),
  ('Nosso Espaço', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=75', 2),
  ('Acabamento na Navalha', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=75', 3),
  ('Corte Clássico', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=75', 4),
  ('Experiência Completa', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=75', 5)
) as v(title, image_url, sort)
where not exists (select 1 from public.gallery);
