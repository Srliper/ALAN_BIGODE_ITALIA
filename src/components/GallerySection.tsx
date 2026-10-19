import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

// Troque por fotos reais da barbearia (coloque os arquivos em /public/galeria e use '/galeria/foto1.jpg').
const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=75', title: 'Fade Moderno' },
  { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=75', title: 'Barba Estilizada' },
  { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=75', title: 'Nosso Espaço' },
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=75', title: 'Acabamento na Navalha' },
  { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=75', title: 'Corte Clássico' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=75', title: 'Experiência Completa' },
];

const GallerySection = () => {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i! + 1) % galleryItems.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i! - 1 + galleryItems.length) % galleryItems.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

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
              key={item.src}
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
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={galleryItems[active].title}
        >
          <button className="absolute top-5 right-5 text-foreground p-2" aria-label="Fechar" onClick={() => setActive(null)}>
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
