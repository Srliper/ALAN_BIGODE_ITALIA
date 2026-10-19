import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { dismiss, useToasts } from '@/hooks/use-toast';

export const Toaster = () => {
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] flex flex-col gap-3 sm:w-96 pointer-events-none"
    >
      {toasts.map((t) => {
        const isError = t.variant === 'destructive';
        const Icon = isError ? AlertCircle : CheckCircle2;
        return (
          <div
            key={t.id}
            role={isError ? 'alert' : 'status'}
            className={`pointer-events-auto flex gap-3 items-start p-4 rounded-xl border shadow-2xl bg-card animate-slide-up ${
              isError ? 'border-destructive/60' : 'border-primary/40'
            }`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isError ? 'text-destructive' : 'text-primary'}`} />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{t.title}</p>
              {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
