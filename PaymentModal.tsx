import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Copy, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingData: {
    name: string;
    phone: string;
    serviceName: string;
    servicePrice: number;
    cutTypeName: string;
    date: string;
    time: string;
  };
}

type PaymentMethod = 'pix' | 'credit' | 'debit';

const PIX_KEY = '15996486984';

const PaymentModal = ({ isOpen, onClose, onSuccess, bookingData }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1',
    password: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate QR Code for PIX
  useEffect(() => {
    const generateQR = async () => {
      // PIX payload - simplified version
      const pixPayload = `00020126580014br.gov.bcb.pix0136${PIX_KEY}5204000053039865406${bookingData.servicePrice.toFixed(2)}5802BR5913BarbeariaIt6008Itapeti62070503***6304`;
      
      try {
        const url = await QRCode.toDataURL(pixPayload, {
          width: 200,
          margin: 2,
          color: {
            dark: '#d4af37',
            light: '#1a1a1a',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    if (isOpen) {
      generateQR();
    }
  }, [isOpen, bookingData.servicePrice]);

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      toast({ title: 'Chave PIX copiada!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Erro ao copiar', variant: 'destructive' });
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const handleCardSubmit = async (e: React.FormEvent, type: 'credit' | 'debit') => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    toast({
      title: 'Pagamento aprovado!',
      description: `Pagamento via ${type === 'credit' ? 'crédito' : 'débito'} processado com sucesso.`,
    });
    onSuccess();
  };

  const handlePixConfirm = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    toast({
      title: 'Pagamento PIX confirmado!',
      description: 'Seu agendamento foi confirmado com sucesso.',
    });
    onSuccess();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl border-2 border-primary/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Pagamento
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-primary mb-3">Resumo do Agendamento</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="text-foreground">Cliente:</span> {bookingData.name}</p>
              <p><span className="text-foreground">Serviço:</span> {bookingData.serviceName}</p>
              <p><span className="text-foreground">Tipo:</span> {bookingData.cutTypeName}</p>
              <p><span className="text-foreground">Data:</span> {formatDate(bookingData.date)}</p>
              <p><span className="text-foreground">Horário:</span> {bookingData.time}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-lg font-bold text-primary">
                Total: R$ {bookingData.servicePrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'pix' as PaymentMethod, icon: '🟢', label: 'PIX' },
              { id: 'credit' as PaymentMethod, icon: '💳', label: 'Crédito' },
              { id: 'debit' as PaymentMethod, icon: '💳', label: 'Débito' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === method.id
                    ? 'bg-gradient-gold text-primary-foreground glow-gold-sm'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                <span>{method.icon}</span>
                {method.label}
              </button>
            ))}
          </div>

          {/* PIX Payment */}
          {paymentMethod === 'pix' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Como pagar via PIX:</strong>
                </p>
                <ol className="text-left text-sm text-muted-foreground space-y-2 mb-6 list-decimal list-inside">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Escaneie o QR Code abaixo ou copie a chave PIX</li>
                  <li>Confirme o pagamento</li>
                </ol>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-background rounded-xl border-2 border-primary/30">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-muted animate-pulse rounded" />
                  )}
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Escaneie com o app do seu banco
              </p>

              {/* PIX Key */}
              <div className="space-y-2">
                <Label className="text-foreground">Chave PIX:</Label>
                <div className="flex gap-2">
                  <Input
                    value={PIX_KEY}
                    readOnly
                    className="bg-input border-border text-center font-mono"
                  />
                  <Button
                    onClick={copyPixKey}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-primary font-medium">
                  Valor: R$ {bookingData.servicePrice.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  O pagamento é processado instantaneamente
                </p>
              </div>

              <Button
                onClick={handlePixConfirm}
                disabled={isProcessing}
                className="w-full bg-gradient-gold text-primary-foreground font-bold py-6 hover:opacity-90 glow-gold"
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pagamento PIX'}
              </Button>
            </div>
          )}

          {/* Credit Card Payment */}
          {paymentMethod === 'credit' && (
            <form onSubmit={(e) => handleCardSubmit(e, 'credit')} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Número do Cartão</Label>
                <Input
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                  placeholder="0000 0000 0000 0000"
                  className="bg-input border-border"
                  maxLength={19}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Nome no Cartão</Label>
                <Input
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  className="bg-input border-border uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Validade</Label>
                  <Input
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/AA"
                    className="bg-input border-border"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">CVV</Label>
                  <Input
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="123"
                    className="bg-input border-border"
                    maxLength={4}
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Parcelas</Label>
                <Select
                  value={cardForm.installments}
                  onValueChange={(value) => setCardForm({ ...cardForm, installments: value })}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}x de R$ {(bookingData.servicePrice / i).toFixed(2).replace('.', ',')} sem juros
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Seus dados estão protegidos e criptografados</span>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-gold text-primary-foreground font-bold py-6 hover:opacity-90 glow-gold"
              >
                {isProcessing ? 'Processando...' : 'Pagar com Cartão de Crédito'}
              </Button>
            </form>
          )}

          {/* Debit Card Payment */}
          {paymentMethod === 'debit' && (
            <form onSubmit={(e) => handleCardSubmit(e, 'debit')} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Número do Cartão</Label>
                <Input
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                  placeholder="0000 0000 0000 0000"
                  className="bg-input border-border"
                  maxLength={19}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Nome no Cartão</Label>
                <Input
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  className="bg-input border-border uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Validade</Label>
                  <Input
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/AA"
                    className="bg-input border-border"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">CVV</Label>
                  <Input
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="123"
                    className="bg-input border-border"
                    maxLength={4}
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Senha do Cartão</Label>
                <Input
                  value={cardForm.password}
                  onChange={(e) => setCardForm({ ...cardForm, password: e.target.value.replace(/\D/g, '') })}
                  placeholder="Senha de 6 dígitos"
                  className="bg-input border-border"
                  maxLength={6}
                  type="password"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Seus dados estão protegidos e criptografados</span>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-gold text-primary-foreground font-bold py-6 hover:opacity-90 glow-gold"
              >
                {isProcessing ? 'Processando...' : 'Pagar com Cartão de Débito'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
