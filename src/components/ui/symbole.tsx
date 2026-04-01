export type SkinCadran = 'altereon' | 'vanguard';

interface SymboleProps {
  estActif: boolean;
  skin: SkinCadran;
  enTransition: boolean;
}

export default function Symbole({ estActif, skin, enTransition }: SymboleProps) {
  const glowFilter = estActif
    ? 'drop-shadow(0 0 8px #d946ef) drop-shadow(0 0 16px #a21caf)'
    : 'none';

  return (
    <svg
      viewBox="0 0 200 200"
      width="208"
      height="208"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: enTransition ? 0 : 1,
        transform: enTransition ? 'scale(0.85) rotate(15deg)' : 'scale(1) rotate(0deg)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}
    >
      {skin === 'altereon' ? (
        <>
          {/* Anneau gris externe */}
          <circle cx="100" cy="100" r="96" fill="#1a1a1a" stroke="#9ca3af" strokeWidth="10" />

          {/* Tirets graduations */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 2 * Math.PI;
            const x1 = 100 + Math.cos(angle) * 88;
            const y1 = 100 + Math.sin(angle) * 88;
            const x2 = 100 + Math.cos(angle) * 94;
            const y2 = 100 + Math.sin(angle) * 94;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4b5563" strokeWidth="1.5" />;
          })}

          {/* Cercle noir intérieur */}
          <circle cx="100" cy="100" r="78" fill="#050505" />

          {/* Symbole PNG */}
          <image
            href="/AlterEon_2.png"
            x="12" y="15"
            width="170" height="170"
            style={{ filter: glowFilter, transition: 'filter 0.7s' }}
          />
        </>
      ) : (
        <>
          {/* ── VANGUARD ── */}

          {/* Patte haut-centre */}
          <rect x="88" y="2" width="24" height="20" rx="4" fill="#6b7280" />
          <rect x="91" y="20" width="18" height="8" rx="2" fill="#4b5563" />

          {/* Patte bas-gauche */}
          <g transform="rotate(120 100 100)">
            <rect x="88" y="2" width="24" height="20" rx="4" fill="#6b7280" />
            <rect x="91" y="20" width="18" height="8" rx="2" fill="#4b5563" />
          </g>

          {/* Patte bas-droite */}
          <g transform="rotate(240 100 100)">
            <rect x="88" y="2" width="24" height="20" rx="4" fill="#6b7280" />
            <rect x="91" y="20" width="18" height="8" rx="2" fill="#4b5563" />
          </g>

          {/* Anneau gris externe */}
          <circle cx="100" cy="100" r="82" fill="#1a1a1a" stroke="#9ca3af" strokeWidth="12" />

          {/* Anneau interne sombre */}
          <circle cx="100" cy="100" r="68" fill="#050505" stroke="#374151" strokeWidth="3" />

          {/* Tirets graduations */}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * 2 * Math.PI;
            const x1 = 100 + Math.cos(angle) * 74;
            const y1 = 100 + Math.sin(angle) * 74;
            const x2 = 100 + Math.cos(angle) * 80;
            const y2 = 100 + Math.sin(angle) * 80;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />;
          })}

          {/* Symbole PNG centré */}
          <image
            href="/AlterEon_2.png"
            x="26" y="28"
            width="148" height="148"
            style={{ filter: glowFilter, transition: 'filter 0.7s' }}
          />

          {/* Capot supérieur (détail Vanguard) */}
          <path
            d="M78 24 Q100 18 122 24 L118 34 Q100 28 82 34 Z"
            fill="#374151"
            stroke="#6b7280"
            strokeWidth="1"
          />
        </>
      )}
    </svg>
  );
}