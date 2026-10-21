// Dados da barbearia — altere aqui e o site inteiro é atualizado.
export const business = {
  name: 'Barbearia Bigode Italia',
  phoneDisplay: '(15) 99964-8684',
  // Somente dígitos, com DDI 55 — usado em links tel: e WhatsApp
  phoneDigits: '5515999648684',
  address: 'Av. João Barth, 503 - Vila Barth',
  city: 'Itapetininga - SP',
  locality: 'Itapetininga',
  region: 'SP',
  cep: '18205-310',
  mapsUrl: 'https://maps.app.goo.gl/Bg84az4wg2bBX6kE6',
  mapsEmbed:
    'https://www.google.com/maps?q=Av.+Jo%C3%A3o+Barth,+503+-+Vila+Barth,+Itapetininga+-+SP,+18205-310&output=embed',
  // Instagram da barbearia (vazio = ícone escondido)
  instagram: 'https://www.instagram.com/barbearia_bigode_italia/',
  // Domínio do site, sem barra no final, ex.: 'https://barbeariaitalia.com.br'
  // Preencha para gerar canonical, og:url e sitemap.xml.
  siteUrl: '',
  // Imagem que aparece ao compartilhar o link (ideal 1200x630). Pode ser '/og.jpg' se colocar em public/.
  ogImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=630&fit=crop&q=80',
  hoursLabel: 'Terça a Sábado, 8h30 – 21h',
  // Horário de abertura e fechamento (HH:MM). O último horário oferecido termina até o fechamento.
  openTime: '08:30',
  closeTime: '21:00',
  // 0 = domingo ... 6 = sábado
  openDays: [2, 3, 4, 5, 6],
};

// Converte '@usuario', 'usuario' ou um link do Instagram em link completo
export const instagramUrl = (value: string) => {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//.test(v)) return v;
  return `https://www.instagram.com/${v.replace(/^@/, '').replace(/\/+$/, '')}/`;
};

// 'https://www.instagram.com/alan70bedim/' -> '@alan70bedim'
export const instagramHandle = (url: string) => '@' + url.replace(/\/+$/, '').split('/').pop();

export const weekdayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const joinPt = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;

// Ex.: "domingo e segunda" — derivado de openDays
export const closedDaysLabel = joinPt(weekdayNames.filter((_, i) => !business.openDays.includes(i)));

export const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${business.phoneDigits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
