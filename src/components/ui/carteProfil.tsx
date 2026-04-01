import { profil } from '../../lib/profil';

export default function CarteProfil() {
  return (
    <div
      className="w-64 bg-zinc-950 rounded-2xl overflow-hidden border border-purple-500/30"
      style={{ boxShadow: '0 0 30px rgba(192,132,252,0.1)' }}
    >
      {/* Bandeau header */}
      <div className="h-16 bg-purple-950/40 relative">
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-full border-4 border-purple-500 overflow-hidden bg-zinc-800">
          <img
            src={profil.photo}
            alt={profil.nom}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              el.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;color:#c084fc">${profil.nom[0]}</div>`;
            }}
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="pt-12 px-5 pb-5">
        <h2 className="text-white font-black text-lg tracking-wide">{profil.nom}</h2>
        <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mt-0.5">{profil.titre}</p>
        <p className="text-zinc-400 text-sm leading-relaxed mt-3">{profil.bio}</p>

        {/* Réseaux */}
        <div className="flex gap-2 mt-4">
          {profil.reseaux.github && (
            <a
              href={profil.reseaux.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-center border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all"
            >
              GitHub
            </a>
          )}
          {profil.reseaux.linkedin && (
            <a
              href={profil.reseaux.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-center bg-purple-500 text-black hover:bg-purple-400 transition-all"
            >
              LinkedIn
            </a>
          )}
        </div>

        {/* Bouton CV PDF */}
        {profil.cv && (
          <a
            href={profil.cv}
            download
            className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-zinc-600 text-zinc-300 hover:border-purple-500 hover:text-purple-400 transition-all"
          >
            {/* Icône téléchargement */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger CV
          </a>
        )}
      </div>
    </div>
  );
}