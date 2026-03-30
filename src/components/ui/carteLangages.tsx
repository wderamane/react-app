import { langages } from '../../lib/profil';

interface ArcLangage {
  nom: string;
  couleur: string;
  pourcentage: number;
  portion: number;
  offset: number;
}

export default function CarteLangages() {
  const total = langages.reduce((s, l) => s + l.pourcentage, 0);
  const rayon = 55;
  const circonference = 2 * Math.PI * rayon;

  const arcs = langages.reduce((acc, lang) => {
    const offset = acc.offset;
    const portion = (lang.pourcentage / total) * circonference;
    acc.items.push({ ...lang, portion, offset });
    acc.offset += portion;
    return acc;
  }, { items: [] as ArcLangage[], offset: 0 }).items;

  return (
    <div
      className="w-64 bg-zinc-950 rounded-2xl overflow-hidden border border-amber-500/30"
      style={{ boxShadow: '0 0 30px rgba(245,158,11,0.1)' }}
    >
      {/* Header */}
      <div className="h-12 bg-amber-950/40 flex items-center justify-center">
        <span className="text-xs font-black tracking-[0.3em] uppercase text-amber-400">Stack technique</span>
      </div>

      <div className="p-5 flex flex-col items-center gap-4">
        {/* Donut */}
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={rayon} fill="none" stroke="#27272a" strokeWidth="22" />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx="70" cy="70" r={rayon}
              fill="none"
              stroke={arc.couleur}
              strokeWidth="22"
              strokeDasharray={`${arc.portion} ${circonference - arc.portion}`}
              strokeDashoffset={-arc.offset + circonference / 4}
            />
          ))}
          <text x="70" y="65" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">langages</text>
          <text x="70" y="80" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">{langages.length}</text>
        </svg>

        {/* Légende */}
        <div className="w-full flex flex-col gap-2">
          {langages.map((lang, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.couleur }} />
              <span className="text-zinc-300 text-xs flex-1">{lang.nom}</span>
              <div className="flex items-center gap-1.5 flex-1">
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${lang.pourcentage}%`, backgroundColor: lang.couleur }} />
                </div>
                <span className="text-zinc-500 text-xs w-7 text-right">{lang.pourcentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}