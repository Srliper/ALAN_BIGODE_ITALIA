import { Armchair, Sparkles, UserCheck, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';

const features = [
  { icon: Armchair, title: 'Ambiente acolhedor', text: 'Um espaço pensado para você relaxar.' },
  { icon: Sparkles, title: 'Produtos premium', text: 'Só usamos marcas de alta qualidade.' },
  { icon: UserCheck, title: 'Atendimento exclusivo', text: 'Cada cliente com atenção total.' },
  { icon: Award, title: 'Barbeiros especialistas', text: 'Técnica clássica e tendências atuais.' },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden section-alt">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=75"
              alt="Barbeiro trabalhando na Barbearia Bigode Italia"
              loading="lazy"
              className="rounded-2xl w-full aspect-[4/5] object-cover border border-primary/30"
            />
            <div className="absolute -bottom-6 -right-2 md:-right-6 bg-gradient-gold text-primary-foreground rounded-2xl px-6 py-4 shadow-xl">
              <p className="font-display text-3xl font-bold leading-none">100%</p>
              <p className="text-sm font-semibold">dedicação em cada corte</p>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Nossa história" title="Sobre a Barbearia Bigode Italia" align="left" />

            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed mb-10">
              <p>
                Na Barbearia Bigode Italia, acreditamos que cada corte é uma obra de arte única. Nossa missão vai além de
                simplesmente cortar cabelo — criamos experiências que elevam sua confiança e estilo.
              </p>
              <p>
                Nossos barbeiros combinam técnicas tradicionais com as tendências mais modernas. Aqui, você não é
                apenas um cliente — você é parte da família Bigode Italia.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 p-4 rounded-xl bg-secondary/40 border border-primary/15">
                  <Icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
