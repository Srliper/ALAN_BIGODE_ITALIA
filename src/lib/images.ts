import { getSupabase, PHOTOS_BUCKET } from './supabase';

// Reduz a foto do celular (vários MB) para no máximo 1600px em WebP antes de enviar
const resize = (file: File, maxSize = 1600): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível converter a foto'))), 'image/webp', 0.82);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Arquivo de imagem inválido'));
    };
    img.src = objectUrl;
  });

export async function uploadPhoto(file: File, folder: 'servicos' | 'galeria') {
  const supabase = await getSupabase();
  const blob = await resize(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, blob, { contentType: 'image/webp' });
  if (error) throw error;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deletePhoto(path: string | null) {
  if (!path) return;
  const supabase = await getSupabase();
  await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
}
