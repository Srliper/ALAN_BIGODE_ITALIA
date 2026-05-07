import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import PaymentModal from './PaymentModal';
import { services } from './ServicesSection';

interface BookingData {
  name: string;
  phone: string;
  service: string;
  cutType: string;
  date: string;
  time: string;
  notes: string;
}

const cutTypes = [
  { value: 'classico', label: 'Clássico' },
  { value: 'moderno', label: 'Moderno' },
  { value: 'fade', label: 'Fade' },
  { value: 'degradado', label: 'Degradado' },
  { value: 'social', label: 'Social' },
  { value: 'militar', label: 'Militar' },
  { value: 'raspado', label: 'Raspado' },
  { value: 'outro', label: 'Outro (especificar nas observações)' },
];

const timeSlots = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00',
];

const BookingSection = () => {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    phone: '',
    service: '',
    cutType: '',
    date: '',
    time: '',
    notes: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhone(e.target.value) });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isDateValid = (dateStr: string) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    // 0 = Sunday, 1 = Monday (closed days)
    return dayOfWeek !== 0 && dayOfWeek !== 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.service || !formData.cutType || !formData.date || !formData.time) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (!isDateValid(formData.date)) {
      toast({
        title: 'Data inválida',
        description: 'Não é possível agendar para domingo ou segunda-feira. Funcionamos de terça a sábado.',
        variant: 'destructive',
      });
      return;
    }

    const selectedService = services.find(s => s.id === formData.service);
    const selectedCutType = cutTypes.find(c => c.value === formData.cutType);

    setBookingDetails({
      ...formData,
      serviceName: selectedService?.name || '',
      servicePrice: selectedService?.priceValue || 0,
      cutTypeName: selectedCutType?.label || '',
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setFormData({
      name: '',
      phone: '',
      service: '',
      cutType: '',
      date: '',
      time: '',
      notes: '',
    });
    toast({
      title: 'Agendamento confirmado!',
      description: 'Você receberá uma confirmação em breve. Obrigado por escolher a Barbearia Italia!',
    });
  };

  return (
    <>
      <section id="booking" className="py-24 relative overflow-hidden" style={{ background: 'var(--booking-bg)' }}>
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
              Agende Seu Horário
            </h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto" />
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gradient-card p-8 rounded-2xl border-2 border-primary/30 backdrop-blur-card">
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border focus:border-primary focus:ring-primary/30"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="bg-input border-border focus:border-primary focus:ring-primary/30"
                  placeholder="(15) 99999-9999"
                  required
                />
              </div>

              {/* Service */}
              <div className="space-y-2">
                <Label className="text-foreground">Serviço *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger className="bg-input border-border focus:border-primary">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="focus:bg-secondary">
                        {service.name} - {service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cut Type */}
              <div className="space-y-2">
                <Label className="text-foreground">Tipo de Corte *</Label>
                <Select value={formData.cutType} onValueChange={(value) => setFormData({ ...formData, cutType: value })}>
                  <SelectTrigger className="bg-input border-border focus:border-primary">
                    <SelectValue placeholder="Selecione o tipo de corte" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {cutTypes.map((cut) => (
                      <SelectItem key={cut.value} value={cut.value} className="focus:bg-secondary">
                        {cut.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={getMinDate()}
                  className="bg-input border-border focus:border-primary focus:ring-primary/30"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Funcionamos de terça a sábado (8h30 - 21h)
                </p>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label className="text-foreground">Horário *</Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger className="bg-input border-border focus:border-primary">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="focus:bg-secondary">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-input border-border focus:border-primary focus:ring-primary/30 min-h-[100px]"
                  placeholder="Alguma observação sobre o corte desejado..."
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-gold text-primary-foreground font-bold text-lg py-6 hover:opacity-90 transition-all glow-gold"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && bookingDetails && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          bookingData={bookingDetails}
        />
      )}
    </>
  );
};

export default BookingSection;
