import Symbole from "./symbole";

interface CadranProps {
  estActif: boolean;
  onAction: () => void;
}

export default function Cadran({ estActif, onAction }: CadranProps) {
  return (
    <button
      onClick={onAction}
      className={
        "relative w-52 h-52 rounded-full flex items-center justify-center border-[6px] transition-all duration-500 outline-none cursor-pointer bg-zinc-950 " +
        (estActif
          ? 'border-purple-700 shadow-[0_0_50px_rgba(147,51,234,0.4)]'
          : 'border-zinc-700 hover:border-zinc-500')
      }
    >
      <div
        className={
          "absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 pointer-events-none transition-opacity duration-300 " +
          (estActif ? 'opacity-100 animate-spin' : 'opacity-0')
        }
        style={{ animationDuration: '2s' }}
      />
      <Symbole estActif={estActif} />
    </button>
  );
}