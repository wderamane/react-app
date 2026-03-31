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

  // Touche A → toggle cadran
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 gap-6 md:gap-8">

      <header className="text-center">
        <h1 className={"text-2xl md:text-4xl font-black tracking-[0.3em] transition-colors duration-500 " + (estActif ? 'text-purple-500' : 'text-gray-800')}>
          Portfolios
        </h1>
        <div className={"h-1 mx-auto mt-2 transition-all duration-500 " + (estActif ? 'bg-purple-500 w-48' : 'bg-gray-800 w-24')} />
      </header>

      {/* Layout : 1 colonne sur mobile, 3 colonnes sur desktop */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-5xl">

        {/* Profil — en haut sur mobile, à gauche sur desktop */}
        <div className="shrink-0 w-full md:w-auto flex justify-center">
          <CarteProfil />
        </div>

        {/* Cadran + roue — centré */}
        <div
          className="relative flex items-center justify-center shrink-0"
          style={{ width: 'min(500px, 90vw)', height: 'min(500px, 90vw)' }}
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
          <Cadran estActif={estActif} onAction={handleCadran} />
        </div>

        {/* Langages — en bas sur mobile, à droite sur desktop */}
        <div className="shrink-0 w-full md:w-auto flex justify-center">
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