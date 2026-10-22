import { ChevronDown, MapPin, Clock } from 'lucide-react';
import { business } from '@/config';

const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Vídeo gerado no Google Flow (docs/PROMPT-VIDEO.md, Flow 2), em loop vai-e-volta, sem som.
          Quem pediu menos movimento no sistema vê só a imagem de capa. */}
      {reducedMotion ? (
        <img
          src="/video/hero-capa.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-capa.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}

      <div className="video-overlay" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm mb-6 animate-fade-in">
          Barbearia em Itapetininga - SP
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
          <span className="text-gradient-gold">Onde Estilo Encontra Tradição</span>
        </h1>

        <div className="w-32 h-1 bg-gradient-gold mx-auto mb-8 rounded-full" />

        <p
          className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Transforme seu visual. Eleve sua confiança. Descubra sua melhor versão.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <a
            href="#booking"
            className="bg-gradient-gold text-primary-foreground font-bold text-base md:text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all glow-gold uppercase tracking-widest"
          >
            Agendar Agora
          </a>
          <a
            href="#services"
            className="border-2 border-primary/60 text-primary font-bold text-base md:text-lg px-10 py-4 rounded-full hover:bg-primary/10 transition-all uppercase tracking-widest"
          >
            Ver Serviços
          </a>
        </div>

        <div
          className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-8 justify-center text-sm text-muted-foreground animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> {business.hoursLabel}
          </span>
          <span className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> {business.address}
          </span>
        </div>
      </div>

      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary animate-bounce hidden md:block"
        aria-label="Rolar para serviços"
      >
        <ChevronDown className="w-10 h-10" />
      </a>
    </section>
  );
};

export default HeroSection;
