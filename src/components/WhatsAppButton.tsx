import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/config';
import { trackEvent } from '@/lib/analytics';

const WhatsAppButton = () => (
  <a
    href={whatsappLink('Olá! Vim pelo site da Barbearia Bigode Italia.')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar no WhatsApp"
    onClick={() => trackEvent('whatsapp_botao_flutuante')}
    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 transition-transform"
  >
    <MessageCircle className="w-7 h-7" />
  </a>
);

export default WhatsAppButton;
