import BrandIcon, { type BrandIconName } from './BrandIcon';
import { useSiteData } from '@/context/SiteData';
import { business, whatsappLink } from '@/config';
import { trackEvent } from '@/lib/analytics';

interface QuickLink {
  label: string;
  icon: BrandIconName;
  href: string;
  external?: boolean;
  highlight?: boolean;
}

// Atalhos no estilo "link na bio": círculos dourados com ícones de traço fino e moldura dourada
const QuickLinks = () => {
  const { products, team } = useSiteData();

  const links: QuickLink[] = [
    { label: 'Agendar', icon: 'poste', href: '#booking', highlight: true },
    { label: 'Serviços', icon: 'tesoura', href: '#services' },
    ...(products.length ? [{ label: 'Produtos', icon: 'pomada' as const, href: '#products' }] : []),
    ...(team.length ? [{ label: 'Equipe', icon: 'coroa' as const, href: '#team' }] : []),
    {
      label: 'WhatsApp',
      icon: 'whatsapp',
      href: whatsappLink(`Olá! Vim pelo site da ${business.name}.`),
      external: true,
    },
    { label: 'Como chegar', icon: 'local', href: business.mapsUrl, external: true },
  ];

  return (
    <section aria-label="Atalhos" className="relative z-10 px-4 pt-2 pb-6">
      <div className="container mx-auto max-w-5xl">
        <nav className="gold-frame rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/60">
          <ul className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  onClick={() => link.external && trackEvent('atalho', { destino: link.label })}
                  className="group flex flex-col items-center gap-3 text-center"
                >
                  <span
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 ${
                      link.highlight
                        ? 'bg-gradient-gold text-primary-foreground shadow-lg shadow-primary/20'
                        : 'border-2 border-primary text-primary group-hover:bg-primary/10'
                    }`}
                  >
                    <BrandIcon name={link.icon} className="w-8 h-8 md:w-10 md:h-10" />
                  </span>
                  <span className="font-display text-[11px] md:text-xs uppercase tracking-[0.25em] text-foreground/90 group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default QuickLinks;
