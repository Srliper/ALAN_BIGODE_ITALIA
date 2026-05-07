const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Barbearia Italia — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
