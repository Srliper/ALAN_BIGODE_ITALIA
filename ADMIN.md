# Painel admin (`/admin`)

No painel, a barbearia altera sozinha, sem mexer no código:

- **Serviços e preços:** nome, preço, duração, descrição, foto, selo (ex.: "Promoção") e se o serviço aparece no site
- **Tipos de corte** do formulário de agendamento
- **Galeria:** envio de fotos dos cortes reais direto do celular (as fotos são reduzidas automaticamente)
- **Equipe:** perfis da seção "Nossa Equipe" (foto, cargo, texto e Instagram). O dono, Alan Bedim, já vem cadastrado
  e aparece com a coroa dourada e um cartão de boas-vindas no topo do painel

As alterações aparecem no site na hora, sem novo deploy.

## Como acessar

Abra o endereço do site com `/admin` no final, por exemplo `https://SEU-SITE.vercel.app/admin`
(ou `https://seudominio.com.br/admin`). Funciona no computador e no celular. Na primeira entrada o painel
abre na aba **Como usar**, com o tutorial de cada função.

## Usuário e senha

- **Usuário:** `@alanbigode` (também funciona sem o @)
- **Senha:** a que o dono escolheu e cadastrou no passo 4. Ela **não fica no código**, porque o código do site é
  público; fica guardada, criptografada, no Supabase.

Por baixo, o Supabase só aceita e-mail como login. O site converte `@alanbigode` no e-mail interno
`alanbigode@barbeariabigodeitalia.com` (o domínio fica em `adminLoginDomain`, no `src/config.ts`). Esse e-mail não
recebe mensagens; ele só serve de identificação.

Para trocar a senha: Supabase → **Authentication → Users** → clique no usuário → **⋯ → Change password** (ou
apague o usuário e crie de novo com a senha nova). Para criar outro login, ex. `@carlos`, crie no Supabase o
usuário `carlos@barbeariabigodeitalia.com`.

## Configuração (uma vez só, ~10 minutos)

1. **Crie uma conta gratuita** em <https://supabase.com> e clique em **New project**.
   Nome: `barbearia-italia`. Região: **South America (São Paulo)**. Guarde a senha do banco
   (ela não é a senha do painel).
2. **Crie as tabelas:** no projeto, abra **SQL Editor → New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria as tabelas, o espaço para as fotos
   e copia os serviços, cortes e fotos que o site tem hoje.
3. **Bloqueie novos cadastros:** **Authentication → Sign In / Providers →** desligue
   **"Allow new users to sign up"**. ⚠️ Esse passo é obrigatório: sem ele, qualquer pessoa poderia criar uma
   conta e alterar o site.
4. **Crie o login do Alan:** **Authentication → Users → Add user → Create new user**:
   - Email: `alanbigode@barbeariabigodeitalia.com`
   - Password: a senha escolhida para o painel
   - marque **Auto Confirm User** e clique em **Create user**
5. **Ligue o site ao Supabase:** o jeito mais fácil é a integração **Supabase** da Vercel (Vercel → projeto →
   **Storage/Integrations → Supabase**), que cria sozinha `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e as outras.
   O site usa **apenas** a URL e a chave pública (publishable ou anon); as secretas (`SERVICE_ROLE`, `SECRET_KEY`,
   senha do banco) nunca entram no código do navegador.

   (Sem a integração, dá para cadastrar à mão `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.)
6. **Faça um novo deploy** na Vercel (Deployments → ⋯ → Redeploy), acesse `https://alan-bigode-italia.vercel.app/admin`
   e entre com o usuário `@alanbigode` e a senha.

Para rodar localmente com o painel, crie um arquivo `.env.local` com as mesmas duas variáveis.

## Sem configurar

Enquanto as variáveis não existirem, o site funciona normalmente com os dados de `src/data/` e o `/admin`
mostra um aviso explicando estes passos.

## Testes

`npm run test:e2e` testa o site e o painel inteiro (login com usuário e senha certos e errados, tutorial, alterar preço,
esconder e criar serviço com foto, perfil do dono e equipe, tipos de corte, envio e exclusão de fotos da galeria, agendamento pelo
WhatsApp) no computador e no celular, usando um Supabase simulado. Roda também no GitHub Actions a cada PR.
