import { useState, useEffect } from 'react';
import { Menu, X, Crown } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Serviços' },
  { href: '#gallery', label: 'Galeria' },
  { href: '#about', label: 'Sobre' },
  { href: '#booking', label: 'Agendar' },
  { href: '#contact', label: 'Contato' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-background/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-primary/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Crown className="w-7 h-7 text-primary" />
            <span className="font-display text-xl md:text-2xl font-bold text-gradient-gold tracking-wide">
              Barbearia Italia
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-gold -translate-x-1/2 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#booking"
            className="hidden lg:inline-flex bg-gradient-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity glow-gold-sm"
          >
            Agendar Agora
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[28rem] pb-6' : 'max-h-0'}`}>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm font-medium uppercase tracking-wider py-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full bg-gradient-gold text-primary-foreground font-semibold py-3 rounded-full"
              >
                Agendar Agora
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
