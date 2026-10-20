import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Site de página única: qualquer caminho além de "/" mostra a página 404
const isHome = ['/', '/index.html'].includes(window.location.pathname);

const App = () => (
  <>
    <Toaster />
    {isHome ? <Index /> : <NotFound />}
    <Analytics />
  </>
);

export default App;
