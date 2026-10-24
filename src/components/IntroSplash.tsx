import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

// Abertura com a revelação do logo (Google Flow → Frameia → public/video/intro.*).
// Aparece só na primeira visita; "?intro=1" no endereço força a exibição para conferir.
const SEEN_KEY = 'intro-vista';

const shouldShow = () => {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('intro')) return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  // Economia de dados ligada no celular: pula a abertura
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;
  try {
    return !localStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
};

// Tela em pé (celular) usa um recorte 5:6 do vídeo, com o selo e o nome bem maiores
const VERSIONS = {
  deitado: { src: '/video/intro', ratio: 16 / 9 },
  empe: { src: '/video/intro-celular', ratio: 600 / 720 },
};

const IntroSplash = () => {
  const [visible, setVisible] = useState(shouldShow);
  const [version] = useState(() =>
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? VERSIONS.empe : VERSIONS.deitado,
  );
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  const close = (reason: 'completa' | 'pulada' | 'erro') => {
    if (closing.current) return;
    closing.current = true;
    trackEvent('intro', { fim: reason });
    setLeaving(true);
    setTimeout(() => setVisible(false), 600);
  };

  useEffect(() => {
    if (!visible) return;
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // sem armazenamento local: a abertura pode aparecer de novo, sem problema
    }
    document.body.style.overflow = 'hidden';
    skipRef.current?.focus();

    // Se o vídeo não começar em 4 s (internet lenta, autoplay bloqueado), entra direto no site
    const fallback = setTimeout(() => {
      if (!videoRef.current || videoRef.current.currentTime === 0) close('erro');
    }, 4000);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close('pulada');
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(fallback);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Abertura da Barbearia Bigode Italia"
      className={`fixed inset-0 z-[100] bg-[#0d0d0b] flex items-center justify-center transition-opacity duration-500 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Caixa no formato do vídeo, o maior possível na tela; degradês fundem as bordas com o fundo */}
      <div
        className="relative"
        style={{ aspectRatio: String(version.ratio), width: `min(100vw, ${version.ratio * 100}vh)` }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => close('completa')}
          onError={() => close('erro')}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${version.src}.webm`} type="video/webm" />
          <source src={`${version.src}.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-[#0d0d0b] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0d0d0b] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-[#0d0d0b] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-[#0d0d0b] to-transparent pointer-events-none" />
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={() => close('pulada')}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-sm font-semibold uppercase tracking-[0.25em] text-primary border border-primary/50 rounded-full px-5 py-2 bg-black/40 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Pular
      </button>
    </div>
  );
};

export default IntroSplash;
