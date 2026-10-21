// Símbolo da marca (coroa + bigode). Arquivos da marca ficam em public/marca/.
const Logo = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <img src="/marca/logo-simbolo.svg" alt="" aria-hidden="true" width={128} height={128} className={`shrink-0 ${className}`} />
);

export default Logo;
