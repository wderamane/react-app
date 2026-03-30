interface SymboleProps {
  estActif: boolean;
}

export default function Symbole({ estActif }: SymboleProps) {
  return (
    <svg
      viewBox="0 0 70 70"
      className={"w-24 h-24 transition-all duration-700 " + (estActif ? 'drop-shadow-[0_0_10px_#c084fc]' : '')}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 8 L56 8 L39 35 L56 62 L14 62 L31 35 Z"
        fill="#0d0d0d"
        stroke={estActif ? '#c084fc' : '#4b5563'}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 13 L50 13 L36 35 L50 57 L20 57 L34 35 Z"
        fill="none"
        stroke={estActif ? '#7c3aed' : '#374151'}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {estActif && (
        <circle cx="35" cy="35" r="3.5" fill="#e9d5ff" className="animate-pulse" />
      )}
    </svg>
  );
}