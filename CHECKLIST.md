# Checklist — Barbearia Bigode Italia

Legenda: ✅ feito · 🔧 você precisa fazer · 📋 precisa de material/decisão sua

## Correções
- ✅ Faixa de preço do Google corrigida (R$ 20 – R$ 80) e gerada automaticamente
- ✅ Chave PIX errada/não usada removida do config
- ✅ Agendamento só oferece horários em que o serviço termina até o fechamento
- ✅ Dias fechados ("domingo e segunda") calculados a partir do config
- 📋 Confirmar a chave PIX correta, se quiser mostrá-la no site

## Painel admin (`/admin`) — veja [ADMIN.md](ADMIN.md)
- ✅ Login com usuário `@alanbigode` + senha, sem senha no código
- ✅ Tutorial "Como usar" dentro do painel (abre sozinho na primeira entrada)
- ✅ Alterar preços, duração, descrição, foto e selo dos serviços; esconder/mostrar; adicionar e excluir
- ✅ Editar, adicionar, remover e ordenar os tipos de corte
- ✅ Enviar fotos de cortes reais para a galeria (direto do celular, reduzidas automaticamente)
- ✅ Site atualiza na hora com os dados do painel
- 🔧 Criar o projeto no Supabase e rodar `supabase/schema.sql`
- 🔧 Desligar "Allow new users to sign up" no Supabase (obrigatório)
- 🔧 Criar no Supabase o usuário `alanbigode@barbeariabigodeitalia.com` com a senha escolhida
- ✅ Integração Supabase na Vercel (`SUPABASE_URL` e chave publishable)
- 🔧 Fazer merge do PR e redeploy
- 🔧 Acessar `alan-bigode-italia.vercel.app/admin` com `@alanbigode` e conferir

## Conteúdo
- ✅ Ícones dourados próprios (estilo "link na bio") nos atalhos abaixo do topo do site
- ✅ Capas de destaques do Instagram (8 ícones, contorno e dourado) em `public/marca/destaques-instagram/`
- ✅ Loja de produtos (seção "Nossos Produtos" + carrinho + pedido pelo WhatsApp) e aba Produtos no painel
- 🔧 Rodar de novo o `supabase/schema.sql` (cria a tabela de produtos; pode rodar sem medo, não apaga nada)
- 📋 Colocar preço e foto dos produtos no painel e marcar "Mostrar no site"
- ✅ Logo próprio (coroa + bigode + bandeira italiana) aplicado no site, favicon, ícone do celular e imagem de compartilhamento — arquivos em `public/marca/`
- ✅ Prompts de vídeo para animar o logo e fazer Reels: [docs/PROMPT-VIDEO.md](docs/PROMPT-VIDEO.md)
- ✅ Seção "A experiência": sequência do Frameia que avança com a rolagem (144 quadros no computador, 96 no celular, em WebP)
- ✅ Vídeo de fundo do topo do site (gerado no Google Flow), em loop, sem som, com imagem de capa
- ✅ Abertura do site com a intro do logo (Google Flow + Frameia): primeira visita, botão "Pular", versão própria para celular. Para rever: `alan-bigode-italia.vercel.app/?intro=1`
- 📋 Reels (Flow 3) no Google Flow — prompts em `docs/PROMPT-VIDEO.md`
- ✅ Mais opções de corte (21: low/mid/high/taper fade, navalhado, undercut, moicano, mullet, crop, infantil, freestyle…)
- 📋 Fotos reais dos cortes → enviar pelo painel, aba Galeria
- 📋 Fotos reais de cada serviço → painel, aba Serviços → "Trocar foto"
- 📋 Foto do hero (topo) e da seção "Sobre" → me mandar os arquivos
- ✅ Imagem de compartilhamento no WhatsApp (1200×630) com o logo
- ✅ Seção "Nossa Equipe" no site, com o Alan Bedim como dono (coroa + Instagram @alan70bedim)
- ✅ Aba Equipe no painel e cartão do dono no topo
- 📋 Foto do Alan e texto sobre ele → painel, aba Equipe (o nome "Alan Bedim" pode ser corrigido lá)
- 📋 Outros barbeiros → painel, aba Equipe → "Adicionar pessoa"
- 📋 Depoimentos ou link das avaliações no Google
- ✅ Instagram da barbearia (@barbearia_bigode_italia) no rodapé, no contato e nos dados do Google

## SEO e métricas
- ✅ JSON-LD, robots.txt, sitemap.xml e manifest gerados a partir do config
- ✅ Vercel Analytics com eventos de clique no WhatsApp
- 🔧 Ativar Web Analytics no painel da Vercel
- ✅ `siteUrl` = alan-bigode-italia.vercel.app (canonical e sitemap). Trocar se tiver domínio próprio
- 🔧 Conferir se o Perfil da Empresa no Google aponta para o site

## Agendamento
- 📋 Pausa de almoço ou horário diferente no sábado?
- 📋 Horários realmente livres (evitar dois clientes no mesmo horário): Google Agenda, app pronto
  (Trinks, AppBarber, Booksy) ou agenda própria no Supabase — decidir

## Técnico
- ✅ Removido react-router-dom (site mais leve); painel carregado só em `/admin`
- ✅ Galeria ampliada acessível por teclado
- ✅ ESLint, typecheck e CI no GitHub Actions
- ✅ 53 testes automáticos do site e do painel (computador e celular)
- 🔧 Horário de funcionamento e telefone continuam em `src/config.ts` (não estão no painel)
