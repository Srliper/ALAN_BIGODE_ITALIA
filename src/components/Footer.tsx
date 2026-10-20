import { Crown, MessageCircle, MapPin, Instagram } from 'lucide-react';
import { business, whatsappLink } from '@/config';

const Footer = () => {
  return (
    <footer className="py-10 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <a href="#home" className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-display text-xl font-bold text-gradient-gold">{business.name}</span>
            </a>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> {business.address}, {business.city}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {business.instagram && (
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center text-primary border border-primary/40 rounded-full hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/40 rounded-full px-5 py-2 hover:bg-primary/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> {business.phoneDisplay}
            </a>
          </div>
        </div>

        <p className="text-muted-foreground text-xs text-center mt-8 pt-6 border-t border-border">
          © {new Date().getFullYear()} {business.name} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
