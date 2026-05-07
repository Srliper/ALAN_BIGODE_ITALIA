import { Scissors, Sparkles, User, Crown, Star, Gem } from 'lucide-react';

const galleryItems = [
  { icon: Scissors, title: 'Corte Clássico' },
  { icon: Sparkles, title: 'Fade Moderno' },
  { icon: User, title: 'Barba Estilizada' },
  { icon: Crown, title: 'Estilo Premium' },
  { icon: Star, title: 'Experiência Completa' },
  { icon: Gem, title: 'Trabalho Artístico' },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24 relative overflow-hidden" style={{ background: 'var(--gallery-bg)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Nossa Galeria
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja alguns dos nossos trabalhos e momentos especiais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer relative border-2 border-primary/30 hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-card transition-all duration-300 group-hover:from-secondary group-hover:to-card/90" />
                
                {/* Animated pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsla(43,76%,50%,0.05)_10px,hsla(43,76%,50%,0.05)_20px)]" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Icon className="w-20 h-20 text-primary mb-4 transform group-hover:scale-115 group-hover:rotate-[-5deg] transition-all duration-300 drop-shadow-lg" />
                  <p className="text-foreground font-semibold text-lg text-center">
                    {item.title}
                  </p>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
