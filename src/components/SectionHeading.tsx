interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) => {
  const left = align === 'left';
  return (
    <div className={`mb-14 ${left ? 'text-center lg:text-left' : 'text-center'}`}>
      {eyebrow && <p className="text-primary uppercase tracking-[0.3em] text-xs mb-3">{eyebrow}</p>}
      <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">{title}</h2>
      <div className={`w-20 h-1 bg-gradient-gold rounded-full mx-auto ${left ? 'lg:mx-0' : ''}`} />
      {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
