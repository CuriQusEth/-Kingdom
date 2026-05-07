import { useGameStore, Buildings, Resources } from '../../store/gameStore';
import { motion } from 'motion/react';
import { Hammer, Castle, Trees, Pickaxe, Wheat, Store, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

const BUILDING_DATA: { id: keyof Buildings; name: string; icon: any; cost: Partial<Resources>;  description: string }[] = [
  { id: 'farm', name: 'Farm', icon: Wheat, cost: { wood: 50, food: 20 }, description: 'Produces food over time and houses 2 citizens.' },
  { id: 'lumbermill', name: 'Lumbermill', icon: Trees, cost: { wood: 100, stone: 20 }, description: 'Increases woodcutters efficiency.' },
  { id: 'quarry', name: 'Quarry', icon: Pickaxe, cost: { wood: 100, stone: 50 }, description: 'Increases miners efficiency.' },
  { id: 'market', name: 'Market', icon: Store, cost: { wood: 200, gold: 50 }, description: 'Taxes trade for passive gold.' },
  { id: 'temple', name: 'Temple', icon: Sparkles, cost: { stone: 300, gold: 100, mana: 50 }, description: 'Generates mana and blesses the land.' },
  { id: 'wizardTower', name: 'Wizard Tower', icon: Wand2, cost: { stone: 500, mana: 200 }, description: 'Deep magical research and mana generation.' },
  { id: 'castle', name: 'Expand Castle', icon: Castle, cost: { wood: 500, stone: 500, gold: 100 }, description: 'Increases max population by 10.' },
];

export function BuildingMenu() {
  const build = useGameStore(state => state.build);
  const buildings = useGameStore(state => state.buildings);
  const resources = useGameStore(state => state.resources);
  const [open, setOpen] = useState(false);

  // Validate cost
  const canAfford = (cost: Partial<Resources>) => {
    return Object.entries(cost).every(([res, amt]) => resources[res as keyof Resources] >= (amt || 0));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 bg-[#3e2723] hover:bg-[#2b1b17] border-2 border-[#D4AF37] text-white p-4 rounded-full shadow-lg shadow-black/50 flex items-center justify-center font-serif transition-colors"
      >
        <Hammer size={24} className="text-[#D4AF37]" />
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 left-4 right-4 md:w-96 md:left-6 z-40 max-h-[60vh] overflow-y-auto building-card p-4 rounded-xl"
        >
          <h2 className="medieval-title text-xl font-black text-[#D4AF37] mb-4 flex items-center gap-2">
            <Castle size={20} /> KINGDOM CONSTRUCTION
          </h2>
          <div className="space-y-3">
            {BUILDING_DATA.map(b => (
              <div key={b.id} className="bg-black/40 rounded-xl p-3 border-l-4 border-[#D4AF37] shadow-inner">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-stone-200">
                    <b.icon size={18} className="text-[#D4AF37]"/>
                    <span className="medieval-title text-[#D4AF37] font-bold tracking-wider text-sm">{b.name} <span className="text-gray-400 font-sans text-[10px] uppercase ml-1">(LV {buildings[b.id]})</span></span>
                  </div>
                  <button
                    onClick={() => { build(b.id); }}
                    disabled={!canAfford(b.cost)}
                    className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors ${canAfford(b.cost) ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-[#3e2723] text-gray-400 border border-gray-600 cursor-not-allowed'}`}
                  >
                    Build
                  </button>
                </div>
                <p className="text-[10px] tracking-wide text-gray-300 mb-2 font-sans italic">{b.description}</p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-semibold">
                  {Object.entries(b.cost).map(([res, amt]) => (
                    <span key={res} className={`${resources[res as keyof Resources] >= (amt || 0) ? 'text-green-400' : 'text-red-400'}`}>
                      {res}: {amt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
