import { useGameStore, Population } from '../../store/gameStore';
import { motion } from 'motion/react';
import { Users, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const JOBS: { id: keyof Omit<Population, 'total' | 'idle'>; name: string }[] = [
  { id: 'farmers', name: 'Farmers' },
  { id: 'woodcutters', name: 'Woodcutters' },
  { id: 'miners', name: 'Miners' },
  { id: 'merchants', name: 'Merchants' },
  { id: 'priests', name: 'Priests' },
  { id: 'wizards', name: 'Wizards' },
];

export function PopulationMenu() {
  const pop = useGameStore(state => state.population);
  const assignWorker = useGameStore(state => state.assignWorker);
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 bg-[#3e2723] hover:bg-[#2b1b17] border-2 border-white/20 text-white p-4 rounded-full shadow-lg shadow-black/50 flex items-center justify-center font-serif transition-colors"
      >
        <div className="relative">
          <Users size={24} />
          {pop.idle > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
              {pop.idle}
            </span>
          )}
        </div>
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 left-4 right-4 md:w-80 md:left-auto md:right-6 z-40 building-card p-4 rounded-xl max-h-[60vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="medieval-title text-xl font-black text-[#D4AF37] flex items-center gap-2">
              <Users size={20} className="text-[#D4AF37]" /> CITIZENS
            </h2>
            <div className="text-right">
              <div className="text-[10px] uppercase text-gray-300 font-sans tracking-wide">Total: {pop.total}</div>
              <div className="text-xs font-bold text-green-400 font-serif">Idle: {pop.idle}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {JOBS.map(job => (
              <div key={job.id} className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/10">
                <span className="text-gray-200 font-serif text-sm tracking-wide">{job.name}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => assignWorker(job.id, -1)}
                    disabled={pop[job.id] === 0}
                    className="p-1 rounded-sm bg-[#3e2723] border border-white/20 text-stone-300 disabled:opacity-30 hover:bg-[#2b1b17]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-mono font-bold w-4 text-center">{pop[job.id]}</span>
                  <button 
                    onClick={() => assignWorker(job.id, 1)}
                    disabled={pop.idle === 0}
                    className="p-1 rounded-sm bg-[#3e2723] border border-[#D4AF37] text-[#D4AF37] disabled:opacity-30 disabled:border-white/20 disabled:text-stone-300 hover:bg-[#2b1b17]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
