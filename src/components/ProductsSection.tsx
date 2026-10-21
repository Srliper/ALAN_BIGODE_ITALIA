import { useMemo, useState } from 'react';
import { Minus, Package, Plus, ShoppingBag, X } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useSiteData } from '@/context/SiteData';
import { business, formatPrice, whatsappLink } from '@/config';
import { trackEvent } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';

// Pedido montado no site e enviado pelo WhatsApp; pagamento e retirada na barbearia
const ProductsSection = () => {
  const { products } = useSiteData();
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = useMemo(
    () => products.filter((p) => cart[p.id]).map((p) => ({ product: p, qty: cart[p.id] })),
    [products, cart],
  );
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.product.priceValue, 0);

  if (!products.length) return null;

  const change = (id: string, delta: number) =>
    setCart((c) => {
      const qty = Math.max(0, Math.min(20, (c[id] ?? 0) + delta));
      const next = { ...c, [id]: qty };
      if (!qty) delete next[id];
      return next;
    });

  const order = () => {
    const message = [
      `Olá! Quero reservar estes produtos na ${business.name}:`,
      '',
      ...items.map((i) => `• ${i.qty}x ${i.product.name} — ${formatPrice(i.qty * i.product.priceValue)}`),
      '',
      `*Total:* ${formatPrice(total)}`,
      'Vou retirar e pagar na barbearia.',
    ].join('\n');
    trackEvent('pedido_produtos_whatsapp', { itens: String(count), total: total.toFixed(2) });
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    toast({ title: 'Pedido montado!', description: 'Envie a mensagem no WhatsApp para reservar seus produtos.' });
    setCart({});
  };

  return (
    <section id="products" className="py-24 relative overflow-hidden section-alt">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow="Leve para casa"
          title="Nossos Produtos"
          subtitle="Pomadas, modeladores e cuidados para barba. Monte seu pedido, reserve pelo WhatsApp e retire na barbearia."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const qty = cart[product.id] ?? 0;
            return (
              <article
                key={product.id}
                className="bg-gradient-card rounded-2xl border border-primary/20 hover:border-primary/50 transition-colors overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-secondary relative flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-12 h-12 text-primary/50" aria-hidden="true" />
                  )}
                  {product.category && (
                    <span className="absolute top-2 left-2 bg-black/70 text-primary text-[10px] md:text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <h3 className="text-base md:text-xl font-bold text-foreground leading-tight">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 flex-1">{product.description}</p>
                  )}
                  <p className="text-primary font-bold text-lg md:text-xl mt-3">{formatPrice(product.priceValue)}</p>
                  <div className="mt-3">
                    {!product.inStock ? (
                      <span className="block text-center text-sm text-muted-foreground border border-border rounded-full py-2">
                        Esgotado
                      </span>
                    ) : qty ? (
                      <div className="flex items-center justify-between border border-primary/40 rounded-full">
                        <button
                          type="button"
                          onClick={() => change(product.id, -1)}
                          aria-label={`Diminuir ${product.name}`}
                          className="p-2 text-primary"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-foreground" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => change(product.id, 1)}
                          aria-label={`Aumentar ${product.name}`}
                          className="p-2 text-primary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => change(product.id, 1)}
                        className="w-full text-sm font-semibold text-primary border border-primary/40 rounded-full py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {count > 0 && (
        <div
          role="region"
          aria-label="Seu pedido"
          className="fixed bottom-4 left-4 right-24 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[28rem] z-40 bg-card border border-primary/50 rounded-2xl shadow-2xl shadow-black/60 p-3 flex items-center gap-3 animate-fade-in"
        >
          <ShoppingBag className="w-6 h-6 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'item' : 'itens'}
              <span className="hidden sm:inline"> · retirada e pagamento na barbearia</span>
            </p>
            <p className="font-bold text-primary">{formatPrice(total)}</p>
          </div>
          <button
            type="button"
            onClick={order}
            className="bg-gradient-gold text-primary-foreground text-sm font-bold rounded-full px-4 py-2 whitespace-nowrap"
          >
            Pedir
          </button>
          <button
            type="button"
            onClick={() => setCart({})}
            aria-label="Limpar pedido"
            className="text-muted-foreground p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
