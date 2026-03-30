import type { Projet } from '../../lib/projets';

interface CarteProjetProps {
  projet: Projet | null;
  onFermer: () => void;
}

export default function CarteProjet({ projet, onFermer }: CarteProjetProps) {
  if (!projet) return null;

  return (
    /* Overlay sombre */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onFermer}
    >
      {/* Carte */}
      <div
        className="relative w-full max-w-md bg-zinc-950 rounded-2xl overflow-hidden border-2 animate-in fade-in zoom-in-95 duration-300"
        style={{ borderColor: projet.couleur, boxShadow: `0 0 60px ${projet.couleur}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header coloré avec symbole */}
        <div
          className="relative h-12 flex items-center justify-center"
          style={{ backgroundColor: `${projet.couleur}22` }}
        >
          <svg viewBox="0 0 70 70" className="w-7 h-7 mr-2" xmlns="http://www.w3.org/2000/svg">
            <path
              d={projet.symbolePath}
              fill="none"
              stroke={projet.couleur}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-sm font-black tracking-[0.3em] uppercase"
            style={{ color: projet.couleur }}
          >
            {projet.nom}
          </span>
          <button
            onClick={onFermer}
            className="absolute right-3 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Screenshot */}
        {projet.screenshot && (
          <div className="w-full h-48 bg-zinc-900 overflow-hidden">
            <img
              src={projet.screenshot}
              alt={projet.nom}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className="p-5">
          <p className="text-zinc-300 text-sm leading-relaxed mb-5">
            {projet.description}
          </p>

          {/* Liens */}
          <div className="flex gap-3">
            {projet.github && (
              <a
                href={projet.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-center border transition-all duration-200 hover:bg-white/5"
                style={{ borderColor: projet.couleur, color: projet.couleur }}
              >
                GitHub
              </a>
            )}
            {projet.demo && (
              <a
                href={projet.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-center transition-all duration-200"
                style={{ backgroundColor: projet.couleur, color: '#000' }}
              >
                Démo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}