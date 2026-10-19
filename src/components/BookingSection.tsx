import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, CalendarCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import SectionHeading from './SectionHeading';
import { services } from './ServicesSection';
import { business, formatPrice, whatsappLink } from '@/config';

interface BookingData {
  name: string;
  phone: string;
  service: string;
  cutType: string;
  date: string;
  time: string;
  notes: string;
}

const emptyForm: BookingData = { name: '', phone: '', service: '', cutType: '', date: '', time: '', notes: '' };

const cutTypes = ['Manter o corte atual', 'Clássico', 'Moderno', 'Fade', 'Degradê', 'Social', 'Militar', 'Raspado', 'Outro (descrever nas observações)'];

const timeSlots = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
];

// 'YYYY-MM-DD' interpretado no fuso local (new Date('YYYY-MM-DD') usa UTC e erra o dia da semana no Brasil)
const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const formatPhone = (value: string) => {
  const n = value.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : '';
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
};

const selectClass =
  'w-full px-3 py-2.5 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23d4a940%27 stroke-width=%273%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.9rem_center]';

const BookingSection = () => {
  const [formData, setFormData] = useState<BookingData>(emptyForm);
  const set = (field: keyof BookingData, value: string) => setFormData((f) => ({ ...f, [field]: value }));

  // "Agendar" num card de serviço pré-seleciona o serviço
  useEffect(() => {
    const onSelect = (e: Event) => set('service', (e as CustomEvent<string>).detail);
    window.addEventListener('select-service', onSelect);
    return () => window.removeEventListener('select-service', onSelect);
  }, []);

  const today = toISODate(new Date());

  const availableSlots = useMemo(() => {
    if (formData.date !== today) return timeSlots;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return timeSlots.filter((t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m > nowMinutes + 30;
    });
  }, [formData.date, today]);

  const isClosedDay = formData.date !== '' && !business.openDays.includes(parseLocalDate(formData.date).getDay());
  const selectedService = services.find((s) => s.id === formData.service);

  const handleDateChange = (value: string) => {
    setFormData((f) => ({ ...f, date: value, time: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone || !formData.service || !formData.cutType || !formData.date || !formData.time) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast({ title: 'Telefone inválido', description: 'Informe o telefone com DDD.', variant: 'destructive' });
      return;
    }

    if (isClosedDay) {
      toast({
        title: 'Data indisponível',
        description: 'Não abrimos domingo e segunda-feira. Funcionamos de terça a sábado.',
        variant: 'destructive',
      });
      return;
    }

    const date = parseLocalDate(formData.date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const message = [
      `Olá! Gostaria de agendar um horário na ${business.name}:`,
      '',
      `*Nome:* ${formData.name.trim()}`,
      `*Telefone:* ${formData.phone}`,
      `*Serviço:* ${selectedService?.name} (${formatPrice(selectedService?.priceValue ?? 0)})`,
      `*Tipo de corte:* ${formData.cutType}`,
      `*Data:* ${date}`,
      `*Horário:* ${formData.time}`,
      ...(selectedService?.badge === 'Semanal' ? ['*Frequência:* toda semana, no mesmo dia e horário'] : []),
      ...(formData.notes.trim() ? [`*Observações:* ${formData.notes.trim()}`] : []),
    ].join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');

    toast({
      title: 'Quase lá!',
      description: 'Envie a mensagem no WhatsApp para confirmar seu horário. Responderemos em breve.',
    });
    setFormData(emptyForm);
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          eyebrow="Reserve já"
          title="Agende Seu Horário"
          subtitle="Preencha os dados abaixo e confirme o agendamento direto pelo nosso WhatsApp."
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto bg-gradient-card p-6 md:p-10 rounded-2xl border border-primary/30 shadow-2xl shadow-black/40"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={formData.phone}
                onChange={(e) => set('phone', formatPhone(e.target.value))}
                className="w-full"
                placeholder="(15) 99999-9999"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Serviço *</Label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => set('service', e.target.value)}
                className={selectClass}
                required
              >
                <option value="" disabled>Selecione um serviço</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatPrice(s.priceValue)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cutType">Tipo de corte *</Label>
              <select
                id="cutType"
                value={formData.cutType}
                onChange={(e) => set('cutType', e.target.value)}
                className={selectClass}
                required
              >
                <option value="" disabled>Selecione o tipo de corte</option>
                {cutTypes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={today}
                className={`w-full ${isClosedDay ? 'border-destructive focus:border-destructive' : ''}`}
                aria-invalid={isClosedDay}
                aria-describedby="date-help"
                required
              />
              <p id="date-help" className={`text-xs ${isClosedDay ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isClosedDay ? 'Fechado neste dia — escolha de terça a sábado.' : business.hoursLabel}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <select
                id="time"
                value={formData.time}
                onChange={(e) => set('time', e.target.value)}
                className={selectClass}
                disabled={!formData.date || isClosedDay}
                required
              >
                <option value="" disabled>
                  {formData.date ? (availableSlots.length ? 'Selecione um horário' : 'Sem horários hoje') : 'Escolha a data primeiro'}
                </option>
                {availableSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => set('notes', e.target.value)}
                className="w-full min-h-[100px]"
                placeholder="Alguma observação sobre o corte desejado..."
              />
            </div>

            {selectedService && (
              <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                <span className="flex items-center gap-2 text-foreground">
                  <CalendarCheck className="w-5 h-5 text-primary" /> {selectedService.name}
                </span>
                {selectedService.badge === 'Semanal' && (
                  <span className="text-xs text-muted-foreground">repete toda semana</span>
                )}
                <span className="font-bold text-primary text-lg">{formatPrice(selectedService.priceValue)}</span>
              </div>
            )}

            <div className="md:col-span-2 space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-gold text-primary-foreground font-bold text-lg py-4 rounded-full hover:opacity-90 glow-gold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Confirmar pelo WhatsApp
              </Button>
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                <Wallet className="w-4 h-4 text-primary shrink-0" />
                Pagamento na barbearia: dinheiro, cartão ou PIX.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
