interface SymboleProps {
  estActif: boolean;
}

export default function Symbole({ estActif }: SymboleProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width="208"
      height="208"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Anneau gris externe */}
      <circle
        cx="100" cy="100" r="96"
        fill="#1a1a1a"
        stroke="#9ca3af"
        strokeWidth="10"
      />

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

      {/* Symbole PNG directement */}
      <image
        href="/AlterEon_2.png"
        x="12" y="15"
        width="170" height="170"
        style={{
          opacity: 1,
          filter: estActif
            ? 'drop-shadow(0 0 8px #d946ef) drop-shadow(0 0 16px #a21caf)'
            : 'none',
          transition: 'opacity 0.7s, filter 0.7s',
        }}
      />
    </svg>
  );
}