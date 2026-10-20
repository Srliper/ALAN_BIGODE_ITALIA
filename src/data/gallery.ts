// Fotos padrão da galeria — troque pelas fotos reais no painel admin (/admin).
export interface GalleryItem {
  title: string;
  src: string;
}

export const defaultGallery: GalleryItem[] = [
  { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=75', title: 'Fade Moderno' },
  { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=75', title: 'Barba Estilizada' },
  { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=75', title: 'Nosso Espaço' },
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=75', title: 'Acabamento na Navalha' },
  { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=75', title: 'Corte Clássico' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=75', title: 'Experiência Completa' },
];
