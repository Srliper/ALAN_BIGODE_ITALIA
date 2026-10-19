import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center">
      <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
      <h1 className="mb-4 text-6xl font-bold text-gradient-gold">404</h1>
      <p className="mb-8 text-xl text-muted-foreground">Ops! Esta página não existe.</p>
      <Link
        to="/"
        className="inline-block bg-gradient-gold text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90"
      >
        Voltar para o início
      </Link>
    </div>
  </div>
);

export default NotFound;
