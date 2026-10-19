import { Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { formatPrice } from '@/config';

interface Service {
  id: string;
  name: string;
  description: string;
  priceValue: number;
  duration: string;
  image: string;
}

const services: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Cabelo',
    description: 'Cortes modernos e clássicos para todos os estilos',
    priceValue: 35,
    duration: '40 min',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop',
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Design e acabamento profissional com toalha quente',
    priceValue: 25,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop',
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'Pacote completo de estilo — o favorito da casa',
    priceValue: 50,
    duration: '1h10',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop',
  },
  {
    id: 'fade',
    name: 'Fade',
    description: 'O corte mais pedido do momento, com degradê perfeito',
    priceValue: 40,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
  },
  {
    id: 'coloracao',
    name: 'Coloração',
    description: 'Transforme seu visual com cores e luzes',
    priceValue: 80,
    duration: '1h30',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop',
  },
  {
    id: 'tratamento',
    name: 'Tratamento Capilar',
    description: 'Hidratação, nutrição e reconstrução profissional',
    priceValue: 45,
    duration: '40 min',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop',
  },
];

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
              <div className="h-48 overflow-hidden bg-secondary">
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
                    <Clock className="w-4 h-4 text-primary" /> {service.duration}
                  </span>
                  <a
                    href={`#booking`}
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
export { services };
export type { Service };
