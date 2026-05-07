import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
        poster="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
      >
        <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/4622088/4622088-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="video-overlay" />

      {/* Gold gradient overlays */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          <span className="text-gradient-gold text-shadow-gold">
            Onde Estilo Encontra Tradição
          </span>
        </h2>
        
        <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8 glow-gold-sm" />
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Transforme seu visual. Eleve sua confiança. Descubra sua melhor versão.
        </p>

        <Button
          onClick={scrollToBooking}
          size="lg"
          className="bg-gradient-gold text-primary-foreground font-bold text-lg px-10 py-6 rounded-full hover:opacity-90 transition-all duration-300 glow-gold uppercase tracking-widest animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Agendar Agora
        </Button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-primary animate-bounce cursor-pointer"
        aria-label="Scroll to services"
      >
        <ChevronDown className="w-10 h-10" />
      </button>
    </section>
  );
};

export default HeroSection;
