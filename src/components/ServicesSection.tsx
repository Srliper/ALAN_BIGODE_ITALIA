import { Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { formatPrice } from '@/config';
import { services, formatDuration } from '@/data/services';

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden section-alt">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading eyebrow="O que fazemos" title="Nossos Serviços" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <article
              key={service.id}
              className="group bg-gradient-card rounded-2xl border border-primary/20 hover:border-primary/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-secondary relative">
                {service.badge && (
                  <span className="absolute top-3 left-3 z-10 bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    {service.badge}
                  </span>
                )}
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-foreground">{service.name}</h3>
                  <span className="text-primary font-bold text-xl whitespace-nowrap">{formatPrice(service.priceValue)}</span>
                </div>
                <p className="text-muted-foreground mb-6 flex-1">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" /> {formatDuration(service.durationMinutes)}
                  </span>
                  <a
                    href="#booking"
                    onClick={() => window.dispatchEvent(new CustomEvent('select-service', { detail: service.id }))}
                    className="text-sm font-semibold text-primary border border-primary/40 rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Agendar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
