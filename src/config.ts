// Dados da barbearia — altere aqui e o site inteiro é atualizado.
export const business = {
  name: 'Barbearia Italia',
  phoneDisplay: '(15) 99964-8684',
  // Somente dígitos, com DDI 55 — usado em links tel: e WhatsApp
  phoneDigits: '5515999648684',
  pixKey: '15996486984',
  address: 'Av. João Barth, 503 - Vila Barth',
  city: 'Itapetininga - SP',
  cep: '18205-310',
  mapsUrl: 'https://maps.app.goo.gl/Bg84az4wg2bBX6kE6',
  mapsEmbed:
    'https://www.google.com/maps?q=Av.+Jo%C3%A3o+Barth,+503+-+Vila+Barth,+Itapetininga+-+SP,+18205-310&output=embed',
  instagram: '',
  hoursLabel: 'Terça a Sábado, 8h30 – 21h',
  // 0 = domingo ... 6 = sábado
  openDays: [2, 3, 4, 5, 6],
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${business.phoneDigits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
