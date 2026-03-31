import Symbole from "./symbole";

interface CadranProps {
  estActif: boolean;
  onAction: () => void;
}

export default function Cadran({ estActif, onAction }: CadranProps) {
  return (
    <button
      onClick={onAction}
      className="relative flex items-center justify-center rounded-full outline-none cursor-pointer bg-transparent border-none transition-all duration-500"
      style={estActif ? { filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.5))' } : {}}
    >
      {/* Anneau de scan */}
      <div
        className={"absolute w-[216px] h-[216px] rounded-full border-2 border-transparent border-t-purple-400 pointer-events-none transition-opacity duration-300 " + (estActif ? 'opacity-100 animate-spin' : 'opacity-0')}
        style={{ animationDuration: '3s' }}
      />
      <Symbole estActif={estActif} />
    </button>
  );
}