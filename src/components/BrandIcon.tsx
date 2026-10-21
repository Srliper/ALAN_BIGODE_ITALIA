// Ícones da marca no estilo dourado (traço fino). Desenhados para viewBox 48x48.
import type { ReactNode } from 'react';

export type BrandIconName = 'poste' | 'tesoura' | 'navalha' | 'bigode' | 'pomada' | 'coroa' | 'local' | 'whatsapp';

const paths: Record<BrandIconName, ReactNode> = {
  poste: (
    <>
      <circle cx="24" cy="5.5" r="2.5" fill="currentColor" />
      <rect x="17" y="8" width="14" height="4" rx="1.5" fill="currentColor" />
      <rect x="18.5" y="12" width="11" height="24" rx="1" />
      <path d="M18.5 15.5 29.5 21M18.5 21.5 29.5 27M18.5 27.5 29.5 33" strokeWidth="2.6" />
      <rect x="17" y="36" width="14" height="4" rx="1.5" fill="currentColor" />
      <path d="M24 40v3" />
      <path d="M19 43h10" />
    </>
  ),
  tesoura: (
    <>
      <circle cx="12" cy="11" r="5" />
      <circle cx="12" cy="31" r="5" />
      <path d="M40 7 16.2 28.2M28.9 24.9 40 35M16.2 13.8 24 21" />
      <path d="M6 40.5h36v2.5H6z" fill="currentColor" />
      <path d="M9 43v3M13 43v3M17 43v3M21 43v3M25 43v3M29 43v3M33 43v3M37 43v3" strokeWidth="1.5" />
    </>
  ),
  navalha: (
    <>
      <path d="M5 29 29 5c5 0 9 4 9 9L17 33z" fill="currentColor" fillOpacity=".2" />
      <path d="M10 25.5 30 6.5" />
      <circle cx="19.5" cy="31" r="1.8" fill="currentColor" />
      <path d="M19.5 31 41 43c2 1 3.5-1 2-2.5L22 28.5" />
    </>
  ),
  bigode: (
    <>
      <g fill="currentColor" stroke="none">
        <g transform="translate(24 24) scale(.44) translate(-64 -69)">
          <path d="M64 66 C69 59 79 58 87 63 C93 67 100 67 104 62 C107 58 105 53 100 53 C106 50 113 55 112 63 C111 72 99 78 88 76 C78 74 70 72 64 77 Z" />
          <path d="M64 66 C59 59 49 58 41 63 C35 67 28 67 24 62 C21 58 23 53 28 53 C22 50 15 55 16 63 C17 72 29 78 40 76 C50 74 58 72 64 77 Z" />
        </g>
      </g>
    </>
  ),
  pomada: (
    <>
      <rect x="6" y="10" width="36" height="9" rx="3" fill="currentColor" fillOpacity=".2" />
      <path d="M8 19v15a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V19" />
      <path d="M15 27h18M19 32h10" />
      <path d="M11 14.5h26" strokeWidth="1.4" />
    </>
  ),
  coroa: (
    <>
      <path d="M10 34 8 15l9 8 7-12 7 12 9-8-2 19z" fill="currentColor" fillOpacity=".18" />
      <path d="M10 39h28" />
      <circle cx="8" cy="13" r="1.8" fill="currentColor" />
      <circle cx="24" cy="9" r="1.8" fill="currentColor" />
      <circle cx="40" cy="13" r="1.8" fill="currentColor" />
    </>
  ),
  local: (
    <>
      <path d="M24 42s13-12.5 13-22a13 13 0 0 0-26 0c0 9.5 13 22 13 22z" />
      <circle cx="24" cy="20" r="5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M8 40l2.5-8.5A16 16 0 1 1 17 38z" />
      <path d="M18 17c0 7 6 13 13 13l2.5-3-4-2-2 1.5c-2-1-4-3-5-5l1.5-2-2-4z" fill="currentColor" strokeWidth="1.4" />
    </>
  ),
};

const BrandIcon = ({ name, className = 'w-8 h-8' }: { name: BrandIconName; className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {paths[name]}
  </svg>
);

export default BrandIcon;
