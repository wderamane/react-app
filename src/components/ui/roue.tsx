import { useCallback, useEffect, useRef, useState } from 'react';
import type { Projet } from '../../lib/projets';

interface RoueProps {
  projets: Projet[];
  onSelect: (projet: Projet) => void;
  onDeselect?: () => void;
  visible: boolean;
  customSounds?: {
    activate?: string;
    nav?: string;
    easter?: string;
  };
}

const MASTER_SEQUENCE = ['right', 'right', 'left', 'left', 'right', 'left'] as const;
const MC_COLOR = '#c084fc';

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default function Roue({ projets, onSelect, onDeselect, visible, customSounds }: RoueProps) {
  const [rotation, setRotation] = useState(0);
  const [indexActif, setIndexActif] = useState(0);
  const [masterMode, setMasterMode] = useState(false);
  const [projetOuvert, setProjetOuvert] = useState(false);

  const total = projets.length;
  const pasAngle = 360 / total;
  const couleurActive = projets[indexActif]?.couleur ?? '#c084fc';

  const audioContext = useRef<AudioContext | null>(null);
  const audioElements = useRef<{ activate?: HTMLAudioElement; nav?: HTMLAudioElement; easter?: HTMLAudioElement }>({});
  const masterIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceBuffer = useRef<string[]>([]);

  const indexActifRef = useRef(indexActif);
  useEffect(() => { indexActifRef.current = indexActif; }, [indexActif]);
  const masterModeRef = useRef(masterMode);
  useEffect(() => { masterModeRef.current = masterMode; }, [masterMode]);
  const projetOuvertRef = useRef(projetOuvert);
  useEffect(() => { projetOuvertRef.current = projetOuvert; }, [projetOuvert]);

  // ── Audio ──────────────────────────────────────────────────────────────────

  const getAudioContext = useCallback(() => {
    if (audioContext.current) return audioContext.current;
    const win = window as WindowWithWebkit;
    const AudioCtx = win.webkitAudioContext ?? AudioContext;
    audioContext.current = new AudioCtx();
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.12;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.setTargetAtTime(0, ctx.currentTime + duration, 0.02);
    osc.stop(ctx.currentTime + duration + 0.05);
  }, [getAudioContext]);

  const playFallback = useCallback((kind: 'activate' | 'nav' | 'easter') => {
    if (kind === 'activate') {
      playTone(300, 0.12, 'triangle');
      setTimeout(() => playTone(440, 0.08, 'triangle'), 70);
    } else if (kind === 'nav') {
      playTone(220, 0.06, 'square');
    } else {
      [0, 80, 160, 240, 320, 400].forEach((delay, i) => {
        setTimeout(() => playTone(300 + i * 80, 0.14, 'sawtooth'), delay);
      });
    }
  }, [playTone]);

  const playSound = useCallback(async (kind: 'activate' | 'nav' | 'easter') => {
    const audio = audioElements.current[kind];
    if (audio) {
      audio.currentTime = 0;
      try { await audio.play(); return; } catch { /* fallback */ }
    }
    playFallback(kind);
  }, [playFallback]);

  useEffect(() => {
    if (!customSounds) return;
    (['activate', 'nav', 'easter'] as const).forEach(kind => {
      const src = customSounds[kind];
      if (!src) return;
      const el = new Audio(src);
      el.preload = 'auto';
      el.volume = 0.45;
      el.load();
      audioElements.current[kind] = el;
    });
  }, [customSounds]);

  // ── Master Control ─────────────────────────────────────────────────────────

  const triggerMasterControl = useCallback(() => {
    if (masterModeRef.current) return;
    setMasterMode(true);
    setProjetOuvert(false);
    void playSound('easter');

    const currentIndex = indexActifRef.current;
    const targetIndex = Math.floor(Math.random() * total);
    const extraTours = 3 * total;
    const diff = (targetIndex - currentIndex + total) % total;
    const totalPas = extraTours + diff;
    let currentPas = 0;
    const vitesseInitiale = 60;
    const vitesseFinale = 240;

    const step = () => {
      if (currentPas >= totalPas) {
        setIndexActif(targetIndex);
        setRotation(-targetIndex * pasAngle);
        setMasterMode(false);
        setTimeout(() => {
          setProjetOuvert(true);
          onSelect(projets[targetIndex]);
          void playSound('activate');
        }, 400);
        masterIntervalRef.current = null;
        return;
      }
      const progress = currentPas / totalPas;
      const vitesse = progress < 0.8
        ? vitesseInitiale
        : vitesseInitiale + (vitesseFinale - vitesseInitiale) * ((progress - 0.8) / 0.2);
      setRotation(r => r - pasAngle);
      setIndexActif(i => (i + 1) % total);
      currentPas++;
      masterIntervalRef.current = setTimeout(step, vitesse);
    };

    masterIntervalRef.current = setTimeout(step, vitesseInitiale);
  }, [total, pasAngle, projets, onSelect, playSound]);

  const checkMasterSequence = useCallback((direction: 'left' | 'right') => {
    const buf = sequenceBuffer.current;
    buf.push(direction);
    if (buf.length > MASTER_SEQUENCE.length) buf.shift();
    if (buf.length === MASTER_SEQUENCE.length && buf.every((v, i) => v === MASTER_SEQUENCE[i])) {
      sequenceBuffer.current = [];
      triggerMasterControl();
    }
  }, [triggerMasterControl]);

  // ── Reset ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) {
      if (masterIntervalRef.current) { clearTimeout(masterIntervalRef.current); masterIntervalRef.current = null; }
      setMasterMode(false);
      setProjetOuvert(false);
      setRotation(0);
      setIndexActif(0);
      sequenceBuffer.current = [];
    }
  }, [visible]);

  // ── Clavier ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Backspace') && projetOuvertRef.current) {
        e.preventDefault();
        setProjetOuvert(false);
        onDeselect?.();
        return;
      }
      if (masterModeRef.current) return;
      if (e.key === 'ArrowRight') {
        setRotation(r => r - pasAngle);
        setIndexActif(i => (i + 1) % total);
        checkMasterSequence('right');
        void playSound('nav');
      } else if (e.key === 'ArrowLeft') {
        setRotation(r => r + pasAngle);
        setIndexActif(i => (i - 1 + total) % total);
        checkMasterSequence('left');
        void playSound('nav');
      } else if (e.key === 'Enter' || e.key === ' ') {
        const idx = indexActifRef.current;
        if (projets[idx]) {
          e.preventDefault();
          setProjetOuvert(true);
          onSelect(projets[idx]);
          void playSound('activate');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, total, pasAngle, projets, onSelect, onDeselect, checkMasterSequence, playSound]);

  if (!visible) return null;

  const SIZE = 500;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_INT = 112;
  const R_EXT = 178;
  const R_ICONES = (R_EXT + R_INT) / 2;

  const anneauFill = masterMode ? 'rgba(192,132,252,0.22)' : 'rgba(88,28,135,0.90)';
  const anneauStroke = masterMode ? MC_COLOR : '#c084fc';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div style={{ width: SIZE, height: SIZE, position: 'relative', flexShrink: 0 }}>

        {/* SVG anneau statique */}
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <circle cx={CX} cy={CY} r={R_EXT} fill={anneauFill} stroke={anneauStroke} strokeWidth="2.5" />
          {masterMode && (
            <>
              <circle cx={CX} cy={CY} r={R_EXT + 10} fill="none" stroke={MC_COLOR} strokeWidth="3" opacity="0.5" />
              <circle cx={CX} cy={CY} r={R_EXT + 20} fill="none" stroke={MC_COLOR} strokeWidth="1.5" opacity="0.25" />
            </>
          )}
          <circle cx={CX} cy={CY} r={R_INT} fill="#000" stroke={masterMode ? MC_COLOR : '#7c3aed'} strokeWidth="2" />
          <circle cx={CX} cy={CY - R_ICONES} r="36" fill={`${masterMode ? MC_COLOR : couleurActive}22`} />
          <polygon
            points={`${CX},${CY - R_EXT + 14} ${CX - 9},${CY - R_EXT - 4} ${CX + 9},${CY - R_EXT - 4}`}
            fill={masterMode ? MC_COLOR : '#f0abfc'}
          />
          {masterMode && (
            <text x={CX} y={CY + R_EXT + 22} textAnchor="middle" fill={MC_COLOR}
              fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="4">
              MASTER CONTROL
            </text>
          )}
        </svg>

        {/* Conteneur rotatif */}
        <div style={{
          position: 'absolute', width: SIZE, height: SIZE, top: 0, left: 0,
          transformOrigin: `${CX}px ${CY}px`,
          transform: `rotate(${rotation}deg)`,
          transition: masterMode ? 'transform 0.08s linear' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {projets.map((projet, i) => {
            const angleDeg = (i / total) * 360 - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = CX + Math.cos(angleRad) * R_ICONES;
            const y = CY + Math.sin(angleRad) * R_ICONES;
            const estSelectionne = i === indexActif;
            const couleurSelect = masterMode ? MC_COLOR : projet.couleur;
            const couleurBord = estSelectionne ? couleurSelect : 'rgba(192,132,252,0.55)';

            return (
              <div key={projet.id} className="absolute pointer-events-auto"
                style={{
                  left: x, top: y,
                  transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                  transition: masterMode ? 'transform 0.08s linear' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                <button
                  disabled={masterMode}
                  onClick={() => {
                    if (masterMode) return;
                    if (estSelectionne) {
                      setProjetOuvert(true);
                      onSelect(projet);
                      void playSound('activate');
                    } else {
                      const diff = (i - indexActif + total) % total;
                      const sens = diff <= total / 2 ? -1 : 1;
                      const pas = diff <= total / 2 ? diff : total - diff;
                      setRotation(r => r + sens * pas * pasAngle);
                      setIndexActif(i);
                      void playSound('nav');
                      checkMasterSequence(sens === -1 ? 'right' : 'left');
                    }
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none',
                    cursor: masterMode ? 'default' : 'pointer', padding: 0,
                  }}
                >
                  <div style={{
                    width: estSelectionne ? 58 : 44, height: estSelectionne ? 58 : 44,
                    borderRadius: '50%',
                    backgroundColor: estSelectionne ? `${couleurSelect}33` : 'rgba(0,0,0,0.4)',
                    border: `${estSelectionne ? 3 : 2}px solid ${couleurBord}`,
                    boxShadow: estSelectionne ? `0 0 22px ${couleurSelect}bb` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                    <svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: estSelectionne ? 32 : 24, height: estSelectionne ? 32 : 24,
                        transition: 'all 0.3s',
                        filter: estSelectionne ? `drop-shadow(0 0 6px ${couleurSelect})` : 'none',
                      }}>
                      <path d={projet.symbolePath} fill="none"
                        stroke={estSelectionne ? couleurSelect : 'rgba(192,132,252,0.75)'}
                        strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: estSelectionne ? couleurSelect : 'transparent',
                    textShadow: estSelectionne ? `0 0 10px ${couleurSelect}` : 'none',
                    transition: 'color 0.3s, text-shadow 0.3s', whiteSpace: 'nowrap',
                  }}>
                    {projet.nom}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <span style={{
            color: masterMode ? 'rgba(192,132,252,0.7)' : 'rgba(192,132,252,0.45)',
            fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
            whiteSpace: 'nowrap', transition: 'color 0.3s',
          }}>
            {masterMode ? '— MASTER CONTROL —' : projetOuvert ? 'échap • fermer' : '← → naviguer • entrée • ouvrir'}
          </span>
        </div>
      </div>
    </div>
  );
}