import type { Projet } from '../../lib/projets';

interface RoueProps {
  projets: Projet[];
  onSelect: (projet: Projet) => void;
  visible: boolean;
}

export default function Roue({ projets, onSelect, visible }: RoueProps) {
  const rayon = 170; // distance du centre en px

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {projets.map((projet, i) => {
        const angle = (i / projets.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * rayon;
        const y = Math.sin(angle) * rayon;

        return (
          <div
            key={projet.id}
            className="absolute pointer-events-auto"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
              opacity: visible ? 1 : 0,
            }}
          >
            <button
              onClick={() => onSelect(projet)}
              className="group flex flex-col items-center gap-1"
            >
              {/* Médaillon alien */}
              <div
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center bg-zinc-950 transition-all duration-300 group-hover:scale-110"
                style={{ borderColor: projet.couleur, boxShadow: `0 0 16px ${projet.couleur}55` }}
              >
                <svg viewBox="0 0 70 70" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={projet.symbolePath}
                    fill="#0d0d0d"
                    stroke={projet.couleur}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Nom sous le médaillon */}
              <span
                className="text-[10px] font-bold tracking-widest uppercase transition-opacity duration-300 opacity-70 group-hover:opacity-100"
                style={{ color: projet.couleur }}
              >
                {projet.nom}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}