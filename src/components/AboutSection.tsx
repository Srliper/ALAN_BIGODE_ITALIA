import { Check } from 'lucide-react';

const features = [
  'Ambiente premium e acolhedor',
  'Produtos premium de alta qualidade',
  'Atendimento exclusivo e personalizado',
  'Barbeiros especialistas certificados',
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: 'var(--about-bg)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-8">
            Sobre a Barbearia Italia
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto mb-10" />

          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed mb-12">
            <p>
              Na Barbearia Italia, acreditamos que cada corte é uma obra de arte única. 
              Nossa missão vai além de simplesmente cortar cabelo - criamos experiências 
              transformadoras que elevam sua confiança e estilo.
            </p>
            <p>
              Com anos de dedicação e paixão pela arte da barbearia, nossos mestres barbeiros 
              combinam técnicas tradicionais com as tendências mais modernas. Cada visita é 
              uma oportunidade de renovação, não apenas do visual, mas também do espírito.
            </p>
            <p>
              Aqui, você não é apenas um cliente - você é parte da família Italia. 
              Valorizamos cada momento, cada detalhe e cada conversa que torna sua 
              experiência verdadeiramente especial.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-secondary/30 px-6 py-3 rounded-full border border-primary/20"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
