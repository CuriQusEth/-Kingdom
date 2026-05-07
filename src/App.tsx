import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { ResourcesBar } from './components/game/ResourcesBar';
import { BuildingMenu } from './components/game/BuildingMenu';
import { PopulationMenu } from './components/game/PopulationMenu';
import { MainView } from './components/game/MainView';
import { Web3Controls } from './components/web3/Web3Controls';
import { motion, AnimatePresence } from 'motion/react';
import { Crown } from 'lucide-react';

export default function App() {
  const gameTick = useGameStore(state => state.gameTick);
  const kingdomName = useGameStore(state => state.kingdomName);
  const setKingdomName = useGameStore(state => state.setKingdomName);
  
  const [showIntro, setShowIntro] = useState(true);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      gameTick();
    }, 1000); // 1 second tick rate
    return () => clearInterval(interval);
  }, [gameTick]);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#1a0f0a] font-sans text-white select-none isometric-grid relative flex flex-col">
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-[100] bg-[#1a0f0a]/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center building-card p-10 py-16 rounded-3xl"
            >
              <Crown size={64} className="text-[#D4AF37] mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl medieval-title font-black text-[#D4AF37] mb-2 uppercase tracking-widest">Establish Your Kingdom</h1>
              <p className="text-stone-300 font-sans tracking-widest text-xs uppercase mb-8">Noble Lord of Ravencrest</p>
              
              <div className="max-w-xs mx-auto mb-8">
                <input 
                  type="text" 
                  value={kingdomName}
                  onChange={(e) => setKingdomName(e.target.value)}
                  className="w-full bg-black/60 border-b-2 border-[#D4AF37] p-3 text-center medieval-title text-xl focus:outline-none transition-colors"
                  placeholder="Name your Kingdom"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIntro(false)}
                className="bg-[#D4AF37] hover:bg-yellow-500 text-[#1a0f0a] px-8 py-3 rounded-full medieval-title font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform"
              >
                BEGIN REIGN
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Interface */}
      <div className="flex-1 relative flex overflow-hidden">
        <MainView />
      </div>
      <ResourcesBar />
      <BuildingMenu />
      <PopulationMenu />
      <Web3Controls />
      
      {/* Title display */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-50 text-center">
        <h2 className="medieval-title text-2xl text-white/50 tracking-widest uppercase">
          {kingdomName}
        </h2>
      </div>
    </div>
  );
}
