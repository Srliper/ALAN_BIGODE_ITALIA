import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaultServices, type Service } from '@/data/services';
import { defaultCutTypes } from '@/data/cutTypes';
import { defaultGallery, type GalleryItem } from '@/data/gallery';
import { fetchRows, isSupabaseConfigured, type CutTypeRow, type GalleryRow, type ServiceRow } from '@/lib/supabase';

interface SiteData {
  services: Service[];
  cutTypes: string[];
  gallery: GalleryItem[];
}

const defaults: SiteData = { services: defaultServices, cutTypes: defaultCutTypes, gallery: defaultGallery };

// Última versão vinda do painel, para o visitante que volta não ver os dados padrão piscando
const CACHE_KEY = 'site-data-v1';

const readCache = (): SiteData | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (data: SiteData) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // sem armazenamento local (aba anônima etc.) — tudo bem
  }
};

const rowToService = (r: ServiceRow): Service => ({
  id: r.id,
  name: r.name,
  description: r.description,
  priceValue: Number(r.price),
  durationMinutes: r.duration_minutes,
  image: r.image_url,
  badge: r.badge || undefined,
});

const loadRemote = async (): Promise<SiteData> => {
  const [services, cutTypes, gallery] = await Promise.all([
    fetchRows<ServiceRow>('services', 'select=*&active=eq.true&order=sort'),
    fetchRows<CutTypeRow>('cut_types', 'select=*&order=sort'),
    fetchRows<GalleryRow>('gallery', 'select=*&order=sort'),
  ]);
  return {
    // Serviços e cortes vazios quebrariam o agendamento, então caem nos padrões
    services: services.length ? services.map(rowToService) : defaults.services,
    cutTypes: cutTypes.length ? cutTypes.map((c) => c.name) : defaults.cutTypes,
    gallery: gallery.map((g) => ({ title: g.title, src: g.image_url })),
  };
};

// O JSON-LD é gerado no build com os preços padrão; aqui ele é atualizado com os preços do painel
const updatePriceRange = (services: Service[]) => {
  const el = document.querySelector('script[type="application/ld+json"]');
  if (!el?.textContent || !services.length) return;
  try {
    const data = JSON.parse(el.textContent);
    const prices = services.map((s) => s.priceValue);
    data.priceRange = `R$ ${Math.min(...prices)} - R$ ${Math.max(...prices)}`;
    el.textContent = JSON.stringify(data);
  } catch {
    // mantém o JSON-LD original
  }
};

const SiteDataContext = createContext<SiteData>(defaults);

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SiteData>(() => (isSupabaseConfigured && readCache()) || defaults);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadRemote()
      .then((remote) => {
        setData(remote);
        writeCache(remote);
        updatePriceRange(remote.services);
      })
      .catch((err) => console.error(err));
  }, []);

  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteData = () => useContext(SiteDataContext);
