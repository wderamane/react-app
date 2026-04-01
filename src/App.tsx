import { useCallback, useEffect, useRef, useState } from 'react';
import Cadran from './components/ui/cadran';
import Roue from './components/ui/roue';
import CarteProjet from './components/ui/carteProjet';
import CarteProfil from './components/ui/carteProfil';
import CarteLangages from './components/ui/carteLangages';
import { projets } from './lib/projets';
import type { Projet } from './lib/projets';

const projetsRoue = projets.filter(p => p.type === 'projet');

export default function App() {
  const [estActif, setEstActif] = useState(false);
  const [selection, setSelection] = useState<Projet | null>(null);

  const activateAudio = useRef<HTMLAudioElement>(new Audio('/sounds/activation.mp3'));
  const openAudio     = useRef<HTMLAudioElement>(new Audio('/sounds/open.mp3'));
  const closeAudio    = useRef<HTMLAudioElement>(new Audio('/sounds/close.mp3'));

  const playSound = (ref: React.RefObject<HTMLAudioElement>) => {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  };

  const handleCadran = useCallback(() => {
    playSound(activateAudio);
    setEstActif(prev => {
      if (prev) setSelection(null);
      return !prev;
    });
  }, []);

  const handleOuvrirProjet = (projet: Projet) => {
    playSound(openAudio);
    setSelection(projet);
  };

  const handleFermerProjet = () => {
    playSound(closeAudio);
    setSelection(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleCadran();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleCadran]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">

      <header className="text-center">
        <h1 className={"text-4xl font-black tracking-[0.3em] transition-colors duration-500 " + (estActif ? 'text-purple-500' : 'text-gray-800')}>
          Portfolios
        </h1>
        <div className={"h-1 mx-auto mt-2 transition-all duration-500 " + (estActif ? 'bg-purple-500 w-48' : 'bg-gray-800 w-24')} />
      </header>

      {/* Layout 3 colonnes fixe */}
      <div className="flex flex-row items-center justify-center gap-8 w-full max-w-5xl">

        {/* Profil */}
        <div className="shrink-0">
          <CarteProfil />
        </div>

        {/* Zone cadran 500×500 */}
        <div
          className="relative shrink-0 flex items-center justify-center"
          style={{ width: 500, height: 500 }}
        >
          <Roue
            projets={projetsRoue}
            onSelect={handleOuvrirProjet}
            onDeselect={handleFermerProjet}
            visible={estActif}
            customSounds={{
              activate: '/sounds/activation.mp3',
              nav: '/sounds/nav.mp3',
              easter: '/sounds/masterC.mp3',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Cadran estActif={estActif} onAction={handleCadran} />
            </div>
          </div>
        </div>

        {/* Langages */}
        <div className="shrink-0">
          <CarteLangages />
        </div>

      </div>

      <footer className="text-zinc-700 text-[10px] tracking-[0.5em] uppercase">
        AlterEon DNA Interface v1.0
      </footer>

      {selection && (
        <CarteProjet projet={selection} onFermer={handleFermerProjet} />
      )}
    </div>
  );
}