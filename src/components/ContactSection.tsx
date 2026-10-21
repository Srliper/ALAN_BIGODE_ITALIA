import { Phone, MapPin, Clock, MessageCircle, Instagram } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { business, closedDaysLabel, instagramHandle, whatsappLink } from '@/config';

const contactInfo = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: business.phoneDisplay,
    href: whatsappLink('Olá! Vim pelo site da Barbearia Bigode Italia.'),
  },
  {
    icon: Phone,
    title: 'Telefone',
    content: business.phoneDisplay,
    href: `tel:+${business.phoneDigits}`,
  },
  {
    icon: MapPin,
    title: 'Endereço',
    content: `${business.address}\n${business.city} — CEP ${business.cep}`,
    href: business.mapsUrl,
  },
  ...(business.instagram
    ? [
        {
          icon: Instagram,
          title: 'Instagram',
          content: instagramHandle(business.instagram),
          href: business.instagram,
        },
      ]
    : []),
  {
    icon: Clock,
    title: 'Horário de funcionamento',
    content: `${business.hoursLabel}\n${closedDaysLabel.charAt(0).toUpperCase()}${closedDaysLabel.slice(1)}: fechado`,
    href: null,
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden section-alt">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow="Fale conosco"
          title="Contato"
          subtitle="Dúvidas, parcerias ou reservas especiais? Estamos à disposição."
        />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const body = (
                <div className="flex gap-4 p-5 h-full bg-gradient-card rounded-xl border border-primary/20 hover:border-primary/50 transition-colors">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary mb-1">{item.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">{item.content}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  {body}
                </a>
              ) : (
                <div key={item.title}>{body}</div>
              );
            })}
          </div>

          <div className="rounded-2xl overflow-hidden border border-primary/30 min-h-[320px] bg-secondary">
            <iframe
              title="Mapa — Barbearia Bigode Italia"
              src={business.mapsEmbed}
              className="w-full h-full min-h-[320px] border-0 grayscale-[60%] invert-[90%] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
