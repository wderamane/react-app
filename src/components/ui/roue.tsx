import { useEffect, useState } from 'react';
import type { Projet } from '../../lib/projets';

interface RoueProps {
  projets: Projet[];
  onSelect: (projet: Projet) => void;
  visible: boolean;
}

export default function Roue({ projets, onSelect, visible }: RoueProps) {
  const [indexActif, setIndexActif] = useState(0);
  const total = projets.length;

  useEffect(() => {
    if (!visible) {
      setIndexActif(0);
      return;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIndexActif(i => (i + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setIndexActif(i => (i - 1 + total) % total);
      } else if (e.key === 'Enter') {
        onSelect(projets[indexActif]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, indexActif, total, projets, onSelect]);

  if (!visible) return null;

  const rayonAnneauExt = 160;
  const rayonAnneauInt = 110;
  const rayonIcones = (rayonAnneauExt + rayonAnneauInt) / 2;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        width="500" height="500"
        viewBox="0 0 500 500"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <circle
          cx="250" cy="250"
          r={rayonAnneauExt}
          fill="rgba(88,28,135,0.85)"
          stroke="#c084fc"
          strokeWidth="2.5"
        />
        <circle
          cx="250" cy="250"
          r={rayonAnneauInt}
          fill="black"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />
        <polygon
          points="250,82 243,96 257,96"
          fill="#e9d5ff"
        />
      </svg>

      {projets.map((projet, i) => {
        const angleBase = ((i - indexActif) / total) * 2 * Math.PI - Math.PI / 2;
        const x = 250 + Math.cos(angleBase) * rayonIcones;
        const y = 250 + Math.sin(angleBase) * rayonIcones;
        const estSelectionne = i === indexActif;

        return (
          <div
            key={projet.id}
            className="absolute pointer-events-auto"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <button
              onClick={() => {
                if (estSelectionne) {
                  onSelect(projet);
                } else {
                  setIndexActif(i);
                }
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className="rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  width: estSelectionne ? 56 : 42,
                  height: estSelectionne ? 56 : 42,
                  backgroundColor: estSelectionne ? projet.couleur + '33' : 'transparent',
                  border: `${estSelectionne ? 3 : 2}px solid ${estSelectionne ? projet.couleur : '#7c3aed'}`,
                  boxShadow: estSelectionne ? `0 0 20px ${projet.couleur}88` : 'none',
                }}
              >
                <svg
                  viewBox="0 0 70 70"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: estSelectionne ? 32 : 24,
                    height: estSelectionne ? 32 : 24,
                    transition: 'all 0.3s',
                    filter: estSelectionne ? `drop-shadow(0 0 6px ${projet.couleur})` : 'none',
                  }}
                >
                  <path
                    d={projet.symbolePath}
                    fill="none"
                    stroke={estSelectionne ? projet.couleur : '#a855f7'}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span
                className="text-[9px] font-black tracking-widest uppercase transition-all duration-300"
                style={{
                  color: estSelectionne ? projet.couleur : 'transparent',
                  textShadow: estSelectionne ? `0 0 10px ${projet.couleur}` : 'none',
                }}
              >
                {projet.nom}
              </span>
            </button>
          </div>
        );
      })}

      <div
        className="absolute bottom-6 flex items-center gap-3 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <span className="text-purple-400/60 text-[10px] tracking-widest uppercase">← → naviguer</span>
        <span className="text-purple-400/60 text-[10px]">•</span>
        <span className="text-purple-400/60 text-[10px] tracking-widest uppercase">entrée sélectionner</span>
      </div>
    </div>
  );
}