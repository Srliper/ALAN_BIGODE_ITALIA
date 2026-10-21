# Checklist — Barbearia Italia

Legenda: ✅ feito · 🔧 você precisa fazer · 📋 precisa de material/decisão sua

## Correções
- ✅ Faixa de preço do Google corrigida (R$ 20 – R$ 80) e gerada automaticamente
- ✅ Chave PIX errada/não usada removida do config
- ✅ Agendamento só oferece horários em que o serviço termina até o fechamento
- ✅ Dias fechados ("domingo e segunda") calculados a partir do config
- 📋 Confirmar a chave PIX correta, se quiser mostrá-la no site

## Painel admin (`/admin`) — veja [ADMIN.md](ADMIN.md)
- ✅ Login só com a senha (com `VITE_ADMIN_EMAIL`), sem senha no código
- ✅ Tutorial "Como usar" dentro do painel (abre sozinho na primeira entrada)
- ✅ Alterar preços, duração, descrição, foto e selo dos serviços; esconder/mostrar; adicionar e excluir
- ✅ Editar, adicionar, remover e ordenar os tipos de corte
- ✅ Enviar fotos de cortes reais para a galeria (direto do celular, reduzidas automaticamente)
- ✅ Site atualiza na hora com os dados do painel
- 🔧 Criar o projeto no Supabase e rodar `supabase/schema.sql`
- 🔧 Desligar "Allow new users to sign up" no Supabase (obrigatório)
- 🔧 Criar o usuário do dono no Supabase com a senha escolhida
- 🔧 Colocar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_ADMIN_EMAIL` na Vercel e fazer redeploy
- 🔧 Acessar `SEU-SITE/admin` e conferir

## Conteúdo
- ✅ Mais opções de corte (21: low/mid/high/taper fade, navalhado, undercut, moicano, mullet, crop, infantil, freestyle…)
- 📋 Fotos reais dos cortes → enviar pelo painel, aba Galeria
- 📋 Fotos reais de cada serviço → painel, aba Serviços → "Trocar foto"
- 📋 Foto do hero (topo) e da seção "Sobre" → me mandar os arquivos
- 📋 Imagem de compartilhamento no WhatsApp (1200×630) → salvar em `public/og.jpg` e trocar `ogImage` no config
- 📋 Seção da equipe: nome, foto e especialidade de cada barbeiro
- 📋 Depoimentos ou link das avaliações no Google
- 📋 Link do Instagram → campo `instagram` em `src/config.ts`

## SEO e métricas
- ✅ JSON-LD, robots.txt, sitemap.xml e manifest gerados a partir do config
- ✅ Vercel Analytics com eventos de clique no WhatsApp
- 🔧 Ativar Web Analytics no painel da Vercel
- 📋 Domínio do site → campo `siteUrl` em `src/config.ts` (gera canonical e sitemap)
- 🔧 Conferir se o Perfil da Empresa no Google aponta para o site

## Agendamento
- 📋 Pausa de almoço ou horário diferente no sábado?
- 📋 Horários realmente livres (evitar dois clientes no mesmo horário): Google Agenda, app pronto
  (Trinks, AppBarber, Booksy) ou agenda própria no Supabase — decidir

## Técnico
- ✅ Removido react-router-dom (site mais leve); painel carregado só em `/admin`
- ✅ Galeria ampliada acessível por teclado
- ✅ ESLint, typecheck e CI no GitHub Actions
- ✅ 29 testes automáticos do site e do painel (computador e celular)
- 🔧 Horário de funcionamento e telefone continuam em `src/config.ts` (não estão no painel)
