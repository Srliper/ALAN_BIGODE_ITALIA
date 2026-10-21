// Serviços padrão — usados enquanto o painel admin (Supabase) não estiver configurado,
// e como base dos dados para o Google gerados no build.
export interface Service {
  id: string;
  name: string;
  description: string;
  priceValue: number;
  durationMinutes: number;
  image: string;
  badge?: string;
}

export const defaultServices: Service[] = [
  {
    id: 'corte',
    name: 'Corte de Cabelo',
    description: 'Cortes modernos e clássicos para todos os estilos',
    priceValue: 35,
    durationMinutes: 40,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop',
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Design e acabamento profissional com toalha quente',
    priceValue: 25,
    durationMinutes: 30,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop',
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'Pacote completo de estilo — o favorito da casa',
    priceValue: 50,
    durationMinutes: 70,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop',
  },
  {
    id: 'fade',
    name: 'Fade',
    description: 'O corte mais pedido do momento, com degradê perfeito',
    priceValue: 40,
    durationMinutes: 45,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
  },
  {
    id: 'coloracao',
    name: 'Coloração',
    description: 'Transforme seu visual com cores e luzes',
    priceValue: 80,
    durationMinutes: 90,
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop',
  },
  {
    id: 'tratamento',
    name: 'Tratamento Capilar',
    description: 'Hidratação, nutrição e reconstrução profissional',
    priceValue: 45,
    durationMinutes: 40,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop',
  },
  {
    id: 'manutencao-semanal',
    name: 'Manutenção Semanal',
    description: 'Acabamento toda semana: pezinho, contorno e barba alinhada para o corte sempre em dia',
    priceValue: 20,
    durationMinutes: 20,
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop',
    badge: 'Semanal',
  },
];

// 40 -> "40 min", 70 -> "1h10", 90 -> "1h30", 60 -> "1h"
export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};
