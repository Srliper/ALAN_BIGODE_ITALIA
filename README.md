# Barbearia Italia

Site da Barbearia Italia (Itapetininga - SP), feito com Vite + React + Tailwind CSS v4.

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção (gera a pasta `dist/`):

```bash
npm run build
```

## Onde editar

- **Telefone, endereço, horário, dias de funcionamento, Instagram, domínio do site:** `src/config.ts`
  - `openTime` / `closeTime` / `openDays` controlam os horários oferecidos no agendamento.
  - `instagram`: preencha com o link completo para mostrar o ícone no rodapé e no contato.
  - `siteUrl`: preencha com o domínio para gerar `canonical`, `og:url` e `sitemap.xml`.
- **Serviços, preços e duração:** `src/data/services.ts`
- **Fotos da galeria:** `src/components/GallerySection.tsx` (coloque fotos próprias em `public/galeria/`)
- **Cores e fontes:** `src/index.css` (bloco `@theme`)

Os dados para o Google (JSON-LD), `robots.txt`, `sitemap.xml` e o manifest são gerados no build a partir
desses arquivos (veja `vite.config.ts`), então não precisam ser editados à mão.

## Verificações

```bash
npm run lint
npm run typecheck
npm run build
```

O GitHub Actions (`.github/workflows/ci.yml`) roda os três em cada PR.

## Métricas

O site usa o Vercel Web Analytics. Ative em Vercel → projeto → **Analytics**. Os cliques em
"Confirmar pelo WhatsApp" aparecem como o evento `agendamento_whatsapp` (com o serviço escolhido) e os
cliques no botão flutuante como `whatsapp_botao_flutuante`. Eventos personalizados exigem um plano pago
da Vercel; as visitas aparecem no plano gratuito.

## Agendamento

O formulário de agendamento não precisa de servidor: ao confirmar, ele abre o WhatsApp da barbearia
com uma mensagem pronta contendo nome, serviço, data e horário.

Só aparecem horários em que o serviço escolhido termina até o fechamento.
