import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefone',
    content: '(15) 99697-8397',
    href: 'tel:+5515996978397',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'contato@barbeariaitalia.com',
    href: 'mailto:contato@barbeariaitalia.com',
  },
  {
    icon: MapPin,
    title: 'Endereço',
    content: 'Avenida João Barth, 503 - Vila Barth\nItapetininga - SP\nCEP: 18205-310',
    href: 'https://maps.app.goo.gl/Bg84az4wg2bBX6kE6?g_st=aw',
  },
  {
    icon: Clock,
    title: 'Horário de Funcionamento',
    content: 'Terça a Sábado: 8h30 - 21h\nDomingo e Segunda: Fechado',
    href: null,
  },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/5515996978397' },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate form submission
    toast({
      title: 'Mensagem enviada!',
      description: 'Entraremos em contato em breve. Obrigado!',
    });
    
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: 'var(--contact-bg)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            Entre em Contato
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex gap-4 p-4 bg-gradient-card rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">
                      {item.content}
                    </p>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block hover:scale-[1.02] transition-transform"
                >
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all border border-primary/20"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-gradient-card p-8 rounded-2xl border-2 border-primary/30 backdrop-blur-card">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-foreground">Nome *</Label>
                <Input
                  id="contactName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-foreground">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border focus:border-primary"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMessage" className="text-foreground">Mensagem *</Label>
                <Textarea
                  id="contactMessage"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-input border-border focus:border-primary min-h-[150px]"
                  placeholder="Sua mensagem..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-gold text-primary-foreground font-bold text-lg py-6 hover:opacity-90 glow-gold"
              >
                Enviar Mensagem
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
