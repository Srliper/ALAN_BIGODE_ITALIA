import { useEffect, useRef, useState } from 'react';
import { CalendarCheck } from 'lucide-react';

// Sequência de quadros (exportada no Frameia a partir do vídeo do Google Flow) que avança conforme a rolagem.
// Computador: 144 quadros 1280x720; celular: 96 quadros 854x480, em public/sequencia/.
const SETS = {
  desktop: { count: 144, path: '/sequencia/desktop/' },
  celular: { count: 96, path: '/sequencia/celular/' },
};

const frameUrl = (path: string, i: number) => `${path}${String(i + 1).padStart(3, '0')}.webp`;

// Frases que aparecem em cada trecho da rolagem (início e fim em fração de 0 a 1)
const captions = [
  { from: 0.02, to: 0.3, eyebrow: 'A experiência', title: 'Ambiente clássico, do jeito que tem que ser' },
  { from: 0.36, to: 0.64, eyebrow: 'Sem pressa', title: 'Cada detalhe pensado para você relaxar' },
  { from: 0.7, to: 1.01, eyebrow: 'Sua cadeira te espera', title: 'Reserve seu horário', cta: true },
];

const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const ScrollSequence = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const set = window.innerWidth < 768 ? SETS.celular : SETS.desktop;
    const images: (HTMLImageElement | undefined)[] = new Array(set.count);
    let current = 0;
    let raf = 0;
    let loadingStarted = false;

    // Desenha cobrindo o canvas (como object-fit: cover)
    const draw = (index: number) => {
      // Usa o quadro carregado mais próximo enquanto os outros chegam
      let i = index;
      while (i > 0 && !images[i]?.complete) i--;
      const img = images[i];
      if (!img?.complete || !img.naturalWidth) return;
      const { width, height } = canvas;
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    };

    const load = (i: number) => {
      if (images[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(set.path, i);
      img.onload = () => {
        if (i === current || (i < current && !images[current]?.complete)) draw(current);
      };
      images[i] = img;
    };

    // Primeiro quadro já; o resto só quando a seção estiver chegando perto da tela
    load(0);
    const loadAll = () => {
      if (loadingStarted) return;
      loadingStarted = true;
      // Carrega de 4 em 4 primeiro (a animação fica utilizável rápido) e depois completa os buracos
      for (const step of [4, 1]) for (let i = 0; i < set.count; i += step) load(i);
    };
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadAll(), {
      rootMargin: '100% 0px',
    });
    observer.observe(section);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      draw(current);
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const index = Math.round(p * (set.count - 1));
      setProgress(p);
      if (index !== current) {
        current = index;
        setFrame(index);
        draw(index);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    resize();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  if (reducedMotion) {
    return (
      <section id="experience" aria-label="A experiência" className="relative py-24 overflow-hidden">
        <img
          src={frameUrl(SETS.desktop.path, 0)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative container mx-auto px-4 text-center space-y-10">
          {captions.map((c) => (
            <Caption key={c.title} {...c} visible />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="A experiência"
      data-frame={frame}
      className="relative h-[320vh] md:h-[400vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 bg-black/45 md:bg-black/30 pointer-events-none" />

        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          {captions.map((c) => (
            <div key={c.title} className="absolute inset-x-4">
              <Caption {...c} visible={progress >= c.from && progress < c.to} />
            </div>
          ))}
        </div>

        {/* Barra de progresso dourada */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-gold" style={{ width: `${progress * 100}%` }} />
      </div>
    </section>
  );
};

const Caption = ({
  eyebrow,
  title,
  cta,
  visible,
}: {
  eyebrow: string;
  title: string;
  cta?: boolean;
  visible: boolean;
}) => (
  <div
    className={`max-w-3xl mx-auto transition-all duration-700 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
    }`}
    aria-hidden={!visible}
  >
    <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm mb-4">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gradient-gold leading-tight drop-shadow-lg">
      {title}
    </h2>
    {cta && (
      <a
        href="#booking"
        tabIndex={visible ? 0 : -1}
        className="mt-8 inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground font-bold px-8 py-4 rounded-full glow-gold hover:opacity-90"
      >
        <CalendarCheck className="w-5 h-5" /> Agendar agora
      </a>
    )}
  </div>
);

export default ScrollSequence;
