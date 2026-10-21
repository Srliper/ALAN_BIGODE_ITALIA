import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { business } from './src/config';
import { defaultServices as services } from './src/data/services';

const schemaDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Gera as tags de SEO, o JSON-LD, robots.txt, sitemap.xml e o manifest a partir de src/config.ts,
// para que telefone, horário e preços nunca fiquem diferentes do que aparece no site.
const seo = (): Plugin => {
  const prices = services.map((s) => s.priceValue);
  const absolute = (url: string) => (url.startsWith('/') && business.siteUrl ? business.siteUrl + url : url);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BarberShop',
    name: business.name,
    telephone: `+${business.phoneDigits}`,
    image: absolute(business.ogImage),
    ...(business.siteUrl && { url: business.siteUrl }),
    hasMap: business.mapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.locality,
      addressRegion: business.region,
      postalCode: business.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: business.openDays.map((d) => schemaDays[d]),
        opens: business.openTime,
        closes: business.closeTime,
      },
    ],
    priceRange: `R$ ${Math.min(...prices)} - R$ ${Math.max(...prices)}`,
    ...(business.instagram && { sameAs: [business.instagram] }),
  };

  return {
    name: 'barbearia-seo',
    transformIndexHtml() {
      const meta = (property: string, content: string): HtmlTagDescriptor => ({
        tag: 'meta',
        attrs: { property, content },
        injectTo: 'head',
      });
      const tags: HtmlTagDescriptor[] = [
        meta('og:image', absolute(business.ogImage)),
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(jsonLd), injectTo: 'head' },
      ];
      if (business.siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${business.siteUrl}/` }, injectTo: 'head' },
          meta('og:url', `${business.siteUrl}/`),
        );
      }
      return tags;
    },
    generateBundle() {
      const emit = (fileName: string, source: string) => this.emitFile({ type: 'asset', fileName, source });

      emit(
        'robots.txt',
        `User-agent: *\nAllow: /\nDisallow: /admin\n${business.siteUrl ? `\nSitemap: ${business.siteUrl}/sitemap.xml\n` : ''}`,
      );
      if (business.siteUrl) {
        emit(
          'sitemap.xml',
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${business.siteUrl}/</loc></url>\n</urlset>\n`,
        );
      }
      emit(
        'manifest.webmanifest',
        JSON.stringify(
          {
            name: business.name,
            short_name: business.name,
            description: `Agende seu horário na ${business.name} pelo WhatsApp.`,
            lang: 'pt-BR',
            start_url: '/',
            display: 'standalone',
            background_color: '#0d0b09',
            theme_color: '#0d0b09',
            icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
          },
          null,
          2,
        ),
      );
    },
  };
};

// A integração Supabase da Vercel cria SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY etc. (sem o prefixo VITE_).
// Só estas variáveis públicas são repassadas ao site; as secretas (service role, senha do banco)
// nunca entram no código do navegador.
const publicEnv = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), '');
  const pick = (...names: string[]) => JSON.stringify(names.map((n) => env[n]).find(Boolean) ?? '');
  return {
    'import.meta.env.VITE_SUPABASE_URL': pick('VITE_SUPABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'),
    // A chave publishable (sb_publishable_…) vem primeiro: com ela dá para desativar as chaves antigas (JWT)
    'import.meta.env.VITE_SUPABASE_ANON_KEY': pick(
      'VITE_SUPABASE_ANON_KEY',
      'SUPABASE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ),
  };
};

export default defineConfig(({ mode }) => ({
  define: publicEnv(mode),
  plugins: [react(), seo()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
