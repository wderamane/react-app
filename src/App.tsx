import { useCallback, useEffect, useRef, useState } from 'react';
import Cadran from './components/ui/cadran';
import Roue from './components/ui/roue';
import CarteProjet from './components/ui/carteProjet';
import CarteProfil from './components/ui/carteProfil';
import CarteLangages from './components/ui/carteLangages';
import { projets } from './lib/projets';
import type { Projet } from './lib/projets';
import type { SkinCadran } from './components/ui/symbole';

const projetsRoue = projets.filter(p => p.type === 'projet');

const SEQ_VANGUARD = ['left', 'left', 'right', 'left', 'right', 'right'] as const;
const SEQ_ALTEREON = ['right', 'right', 'left', 'right', 'left', 'left'] as const;

export default function App() {
  const [estActif, setEstActif] = useState(false);
  const [selection, setSelection] = useState<Projet | null>(null);
  const [skin, setSkin] = useState<SkinCadran>('altereon');
  const [enTransition, setEnTransition] = useState(false);

  const activateAudio = useRef<HTMLAudioElement>(new Audio('/sounds/activation.mp3'));
  const openAudio     = useRef<HTMLAudioElement>(new Audio('/sounds/open.mp3'));
  const closeAudio    = useRef<HTMLAudioElement>(new Audio('/sounds/close.mp3'));
  const skinAudio     = useRef<HTMLAudioElement>(new Audio('/sounds/skin.mp3'));

  // Son ambient — boucle pendant que la roue est ouverte
  const ambientAudio  = useRef<HTMLAudioElement | null>(null);

  const skinBuffer = useRef<string[]>([]);

  const playSound = (ref: React.RefObject<HTMLAudioElement>) => {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  };

  // Démarre le son ambient en boucle
  const startAmbient = () => {
    if (!ambientAudio.current) {
      const audio = new Audio('/sounds/ambient.mp3');
      audio.loop = true;
      audio.volume = 0.18; // discret
      ambientAudio.current = audio;
    }
    void ambientAudio.current.play().catch(() => {});
  };

  // Arrête le son ambient avec un fade out
  const stopAmbient = () => {
    const audio = ambientAudio.current;
    if (!audio) return;
    // Fade out progressif sur 800ms
    const fadeStep = audio.volume / 20;
    const fade = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume = Math.max(0, audio.volume - fadeStep);
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.18;
        clearInterval(fade);
      }
    }, 40);
  };

  const handleCadran = useCallback(() => {
    playSound(activateAudio);
    setEstActif(prev => {
      const prochainEtat = !prev;
      if (prochainEtat) {
        startAmbient();
      } else {
        stopAmbient();
        setSelection(null);
      }
      return prochainEtat;
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

  const triggerSkinTransition = useCallback((nouveauSkin: SkinCadran) => {
    setEnTransition(true);
    playSound(skinAudio);
    setTimeout(() => {
      setSkin(nouveauSkin);
      setTimeout(() => setEnTransition(false), 350);
    }, 300);
  }, []);

  const checkSkinSequence = useCallback((direction: 'left' | 'right') => {
    const buf = skinBuffer.current;
    buf.push(direction);
    if (buf.length > SEQ_VANGUARD.length) buf.shift();

    if (buf.length === SEQ_VANGUARD.length) {
      if (buf.every((v, i) => v === SEQ_VANGUARD[i])) {
        skinBuffer.current = [];
        triggerSkinTransition('vanguard');
        return;
      }
      if (buf.every((v, i) => v === SEQ_ALTEREON[i])) {
        skinBuffer.current = [];
        triggerSkinTransition('altereon');
        return;
      }
    }
  }, [triggerSkinTransition]);

  // Nettoie l'audio au démontage
  useEffect(() => {
    return () => {
      ambientAudio.current?.pause();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleCadran();
        return;
      }

      if (!estActif) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          checkSkinSequence('left');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          checkSkinSequence('right');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleCadran, estActif, checkSkinSequence]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">

      <header className="text-center">
        <h1 className={"text-4xl font-black tracking-[0.3em] transition-colors duration-500 " + (estActif ? 'text-purple-500' : 'text-gray-800')}>
          Portfolios
        </h1>
        <div className={"h-1 mx-auto mt-2 transition-all duration-500 " + (estActif ? 'bg-purple-500 w-48' : 'bg-gray-800 w-24')} />
      </header>

      <div className="flex flex-row items-center justify-center gap-8 w-full max-w-5xl">

        <div className="shrink-0">
          <CarteProfil />
        </div>

        <div
          className="relative shrink-0 flex items-center justify-center"
          style={{ width: 500, height: 500 }}
        >
          <Roue
            projets={projetsRoue}
            onSelect={handleOuvrirProjet}
            onDeselect={handleFermerProjet}
            visible={estActif}
            onNavigation={checkSkinSequence}
            customSounds={{
              activate: '/sounds/activation.mp3',
              nav: '/sounds/nav.mp3',
              easter: '/sounds/masterC.mp3',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Cadran
                estActif={estActif}
                onAction={handleCadran}
                skin={skin}
                enTransition={enTransition}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <CarteLangages />
        </div>

      </div>

      <footer className="text-zinc-700 text-[10px] tracking-[0.5em] uppercase">
        {skin === 'vanguard' ? 'Vanguard Interface v2.0' : 'AlterEon DNA Interface v1.0'}
      </footer>

      {selection && (
        <CarteProjet projet={selection} onFermer={handleFermerProjet} />
      )}
    </div>
  );
}