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
- ✅ Logo próprio (coroa + bigode + bandeira italiana) aplicado no site, favicon, ícone do celular e imagem de compartilhamento — arquivos em `public/marca/`
- ✅ Prompts de vídeo para animar o logo e fazer Reels: [docs/PROMPT-VIDEO.md](docs/PROMPT-VIDEO.md)
- 📋 Gerar os vídeos no app de IA e me mandar o vídeo de fundo do site (MP4, até 8 MB)
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
- ✅ 35 testes automáticos do site e do painel (computador e celular)
- 🔧 Horário de funcionamento e telefone continuam em `src/config.ts` (não estão no painel)
