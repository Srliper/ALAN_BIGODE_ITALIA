const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: 'var(--contact-bg)' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">Contato</h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">Fale conosco para dúvidas, parcerias ou reservas especiais.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-card p-8 rounded-2xl border-2 border-primary/30">
          <p className="text-muted-foreground mb-4">Telefone: <a href="tel:+5515999648684" className="text-primary">(15) 99964-8684</a></p>
          <p className="text-muted-foreground mb-4">Endereço: Av. João Barth - Vila Barth, 503 - Itapetininga - SP  </p>
          <p className="text-muted-foreground">CEP: 18205-310</p>
          <p className="text-muted-foreground">Horário: Terça a Sábado, 8h30 - 21h</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
