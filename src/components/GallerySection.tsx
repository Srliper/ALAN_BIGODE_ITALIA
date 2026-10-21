import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useSiteData } from '@/context/SiteData';

const GallerySection = () => {
  const { gallery: galleryItems } = useSiteData();
  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Ao abrir, o foco vai para o "Fechar"; ao fechar, volta para a foto que foi clicada
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i! + 1) % galleryItems.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i! - 1 + galleryItems.length) % galleryItems.length);
      // Mantém o Tab circulando dentro da foto ampliada
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus();
    };
  }, [isOpen, galleryItems.length]);

  if (!galleryItems.length) return null;

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow="Portfólio"
          title="Nossa Galeria"
          subtitle="Veja alguns dos nossos trabalhos e momentos especiais"
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {galleryItems.map((item, index) => (
            <button
              key={item.src + index}
              onClick={() => setActive(index)}
              className="group aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden relative border border-primary/20 hover:border-primary transition-colors bg-secondary"
              aria-label={`Ampliar foto: ${item.title}`}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <p className="absolute bottom-3 left-3 md:bottom-5 md:left-5 text-foreground font-semibold text-sm md:text-lg text-left">
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={galleryItems[active].title}
        >
          <button
            ref={closeRef}
            className="absolute top-5 right-5 text-foreground p-2"
            aria-label="Fechar"
            onClick={() => setActive(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-2 md:left-6 text-foreground p-2"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + galleryItems.length) % galleryItems.length);
            }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems[active].src.replace('w=900', 'w=1600')}
              alt={galleryItems[active].title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <figcaption className="text-center text-foreground mt-4 font-display text-xl">
              {galleryItems[active].title}
            </figcaption>
          </figure>
          <button
            className="absolute right-2 md:right-6 text-foreground p-2"
            aria-label="Próxima foto"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % galleryItems.length);
            }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
