import { useState } from 'react';
import Cadran from './components/ui/cadran';
import Roue from './components/ui/roue';
import CarteProjet from './components/ui/carteProjet';
import CarteProfil from './components/ui/carteProfil';
import CarteLangages from './components/ui/carteLangages';
import { projets} from './lib/projets';
import type { Projet } from './lib/projets';
// On garde uniquement les projets dans la roue
const projetsRoue = projets.filter(p => p.type === 'projet');

export default function App() {
  const [estActif, setEstActif] = useState(false);
  const [selection, setSelection] = useState<Projet | null>(null);

  const handleCadran = () => {
    setEstActif(!estActif);
    if (estActif) setSelection(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">

      <header className="text-center">
        <h1 className={"text-4xl font-black tracking-[0.3em] transition-colors duration-500 " + (estActif ? 'text-purple-500' : 'text-gray-800')}>
          Portfolios
        </h1>
        <div className={"h-1 mx-auto mt-2 transition-all duration-500 " + (estActif ? 'bg-purple-500 w-48' : 'bg-gray-800 w-24')} />
      </header>

      {/* Layout 3 colonnes */}
      <div className="flex items-center justify-center gap-8 w-full max-w-5xl">

        {/* Gauche — profil */}
        <div className="shrink-0">
          <CarteProfil />
        </div>

        {/* Centre — cadran + roue */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: '500px', height: '500px' }}>
          <Roue projets={projetsRoue} onSelect={setSelection} visible={estActif} />
          <Cadran estActif={estActif} onAction={handleCadran} />
        </div>

        {/* Droite — langages */}
        <div className="shrink-0">
          <CarteLangages />
        </div>

      </div>

      <footer className="text-zinc-700 text-[10px] tracking-[0.5em] uppercase">
        AlterEon DNA Interface v1.0
      </footer>

      {/* Overlay carte projet */}
      {selection && (
        <CarteProjet projet={selection} onFermer={() => setSelection(null)} />
      )}
    </div>
  );
}