import { useCallback, useEffect, useRef, useState } from 'react';
import type { SkinCadran } from './symbole';
import Symbole from './symbole';

interface CadranProps {
  estActif: boolean;
  onAction: () => void;
  skin: SkinCadran;
  enTransition: boolean;
}

const IDLE_DELAY = 30_000;

export default function Cadran({ estActif, onAction, skin, enTransition }: CadranProps) {
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = useCallback(() => {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setIdle(true);
    }, IDLE_DELAY);
  }, []);

  useEffect(() => {
    resetIdle();
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'] as const;
    events.forEach(ev => window.addEventListener(ev, resetIdle, { passive: true }));
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(ev => window.removeEventListener(ev, resetIdle));
    };
  }, [resetIdle]);

  const isIdle = idle && !estActif;

  return (
    <button
      onClick={onAction}
      className="relative flex items-center justify-center rounded-full outline-none cursor-pointer bg-transparent border-none"
    >
      <style>{`
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(192,132,252,0.15)); }
          50%       { filter: drop-shadow(0 0 16px rgba(192,132,252,0.8)) drop-shadow(0 0 32px rgba(168,85,247,0.4)); }
        }
      `}</style>

      {/* Anneau de scan actif */}
      <div
        className={"absolute w-[216px] h-[216px] rounded-full border-2 border-transparent border-t-purple-400 pointer-events-none transition-opacity duration-300 " + (estActif ? 'opacity-100 animate-spin' : 'opacity-0')}
        style={{ animationDuration: '3s' }}
      />

      {/* Flash de transition skin */}
      {enTransition && (
        <div
          className="absolute inset-0 rounded-full bg-purple-400 pointer-events-none"
          style={{ opacity: 0.3, zIndex: 10 }}
        />
      )}

      {/* Symbole */}
      <div
        style={
          estActif
            ? { filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.5))' }
            : isIdle
              ? { animation: 'glowPulse 2.8s ease-in-out infinite' }
              : { filter: 'none' }
        }
      >
        <Symbole estActif={estActif} skin={skin} enTransition={enTransition} />
      </div>

      {/* Badge skin */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest uppercase transition-all duration-500"
        style={{ color: skin === 'vanguard' ? '#a78bfa' : '#7c3aed' }}
      >
        {skin === 'vanguard' ? 'Vanguard' : 'AlterEon'}
      </div>
    </button>
  );
}