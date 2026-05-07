import { useGameStore } from '../../store/gameStore';
import { motion } from 'motion/react';
import { Pickaxe, Trees, Wheat, Coins, Sparkles } from 'lucide-react';

export function ResourcesBar() {
  const resources = useGameStore(state => state.resources);
  const day = useGameStore(state => state.day);
  const season = useGameStore(state => state.season);
  const kingdomName = useGameStore(state => state.kingdomName);

  const resourceItems = [
    { name: 'Wood', value: resources.wood, icon: <Trees size={14} className="text-emerald-500" /> },
    { name: 'Stone', value: resources.stone, icon: <Pickaxe size={14} className="text-stone-400" /> },
    { name: 'Food', value: resources.food, icon: <Wheat size={14} className="text-amber-500" /> },
    { name: 'Gold', value: resources.gold, icon: <Coins size={14} className="text-[#D4AF37]" /> },
    { name: 'Mana', value: resources.mana, icon: <Sparkles size={14} className="text-purple-400" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#2b1b17] border-b-2 border-[#D4AF37] px-4 md:px-6 flex items-center justify-between z-50 shrink-0 shadow-2xl pointer-events-auto">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-gradient-to-br from-yellow-600 to-yellow-900 items-center justify-center">
          <span className="text-[10px] font-bold text-white shadow-sm font-sans drop-shadow-md">D {Math.floor(day)}</span>
        </div>
        <div>
          <h1 className="medieval-title text-sm md:text-base font-black tracking-widest text-[#D4AF37] truncate max-w-[120px] sm:max-w-[200px]">{kingdomName || 'New Kingdom'}</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{season} • Score: {useGameStore.getState().calcProsperityScore()}</p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3 flex-wrap justify-end">
        {resourceItems.map(res => (
          <div key={res.name} className="resource-pill px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 rounded-md transition-all hover:bg-black/80">
            {res.icon}
            <span className="text-[10px] sm:text-xs font-mono text-gray-200">{Math.floor(res.value)}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
