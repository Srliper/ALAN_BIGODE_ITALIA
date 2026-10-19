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

- **Telefone, endereço, horário, chave PIX:** `src/config.ts`
- **Serviços e preços:** `src/components/ServicesSection.tsx`
- **Fotos da galeria:** `src/components/GallerySection.tsx` (coloque fotos próprias em `public/galeria/`)
- **Cores e fontes:** `src/index.css` (bloco `@theme`)

## Agendamento

O formulário de agendamento não precisa de servidor: ao confirmar, ele abre o WhatsApp da barbearia
com uma mensagem pronta contendo nome, serviço, data e horário.
