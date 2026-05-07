

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  image: string;
}

const services: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Cabelo',
    description: 'Cortes modernos e clássicos para todos os estilos',
    price: 'R$ 35,00',
    priceValue: 35,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop',
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Design e acabamento profissional',
    price: 'R$ 25,00',
    priceValue: 25,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop',
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'Pacote completo de estilo',
    price: 'R$ 50,00',
    priceValue: 50,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop',
  },
  {
    id: 'coloracao',
    name: 'Coloração',
    description: 'Transforme seu visual com cores',
    price: 'R$ 80,00',
    priceValue: 80,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  },
  {
    id: 'tratamento',
    name: 'Tratamento Capilar',
    description: 'Hidratação, nutrição e reconstrução profissional',
    price: 'R$ 45,00',
    priceValue: 45,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
  },
  {
    id: 'fade',
    name: 'Fade',
    description: 'O corte mais pedido do momento',
    price: 'R$ 40,00',
    priceValue: 40,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: 'var(--services-bg)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Nossos Serviços
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group bg-gradient-card rounded-2xl p-8 border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-4 backdrop-blur-card overflow-hidden relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>

              {/* Service Image */}
              <div className="w-28 h-28 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-300 group-hover:scale-110 transform">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover brightness-90 contrast-110 group-hover:brightness-100 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Service Info */}
              <h3 className="text-xl font-bold text-primary mb-3 text-center text-shadow-gold">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {service.description}
              </p>

              {/* Price */}
              <div className="text-center">
                <span className="inline-block bg-secondary/50 px-6 py-2 rounded-full text-primary font-bold text-lg border border-primary/30 glow-gold-sm">
                  {service.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
export { services };
export type { Service };
