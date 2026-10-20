import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { SiteDataProvider } from '@/context/SiteData';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// O painel só é baixado por quem abre /admin
const Admin = lazy(() => import('@/pages/Admin'));

const path = window.location.pathname.replace(/\/+$/, '') || '/';

const page = () => {
  if (path === '/admin')
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  if (path === '/' || path === '/index.html')
    return (
      <SiteDataProvider>
        <Index />
      </SiteDataProvider>
    );
  return <NotFound />;
};

const App = () => (
  <>
    <Toaster />
    {page()}
    <Analytics />
  </>
);

export default App;
