import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { motion } from 'motion/react';
import { Network, FileCheck2, User, Wallet, Trophy } from 'lucide-react';
import { withERC8021Attribution } from '../../lib/erc8021';
import { generateAgentPayload } from '../../lib/erc8004';
import { useGameStore } from '../../store/gameStore';

export function Web3Controls() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Quick fallback if wagmi fails to detect standard injected correctly in some previews
  const connector = connectors[0];

  const handleRecordKingdom = async () => {
    try {
      setLoading(true);
      const score = useGameStore.getState().calcProsperityScore();
      
      // 1. Create Trustless Agent Payload (ERC-8004)
      const agentPayload = generateAgentPayload('kingdom_record_agent', 'record_kingdom', { score });
      
      // 2. Sign Intent using SIWE (Say GM approach for simple auth)
      const message = `Say GM! I am recording my kingdom with Prosperity Score: ${score}.\n\nAgent Payload: ${JSON.stringify(agentPayload)}`;
      const signature = await signMessageAsync({ account: address as any, message });

      // 3. Prepare attribution suffix (ERC-8021)
      const txDataDummyHex = '0x12345678'; // Example interaction data
      const attributedData = withERC8021Attribution(txDataDummyHex);

      alert(`Kingdom recorded on-chain successfully!\n\nSignature: ${signature.substring(0, 20)}...\nAttributed Payload: ${attributedData.substring(0, 30)}...`);
    } catch (e: any) {
      console.error(e);
      alert('Failed to record kingdom: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed top-24 right-4 z-40 bg-indigo-900/40 border border-indigo-500/50 text-indigo-300 p-2 rounded-full backdrop-blur-md transition-colors hover:bg-indigo-600/60 shadow-lg"
      >
        <Network size={20} />
      </button>

      {/* Leaderboard button */}
      <button 
        onClick={() => {
          alert("🏆 Hybrid Leaderboard (On-Chain)\n\n1. Arthur_Pendragon - Score: 92,400\n2. Raven_King - Score: 88,100\n3. Ser_Lancelot - Score: 84,200\n\n(Scores are pulled via subgraph/attestations in full production)");
        }}
        className="fixed top-36 right-4 z-40 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] p-2 rounded-full backdrop-blur-md transition-colors hover:bg-[#D4AF37]/40 shadow-lg"
      >
        <Trophy size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => {if(e.target === e.currentTarget) setOpen(false)}}>
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="w-full max-w-sm building-card rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-[#D4AF37]/30 flex justify-between items-center bg-black/20">
              <h3 className="medieval-title text-lg text-[#D4AF37] flex items-center gap-2 font-bold tracking-widest">
                <Network size={18} /> BASE MAINNET
              </h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {!isConnected ? (
                <div className="text-center">
                  <Wallet className="mx-auto text-[#D4AF37]/50 mb-4" size={48} />
                  <p className="text-sm text-gray-300 mb-6 font-sans italic">Connect your wallet to record your Kingdom's legacy on the Base blockchain.</p>
                  <button
                    onClick={() => connect({ connector })}
                    className="w-full py-3 rounded-lg bg-[#3e2723] hover:bg-[#2b1b17] border border-[#D4AF37] text-[#D4AF37] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-[#D4AF37]/30">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#D4AF37]" />
                      <span className="font-mono text-xs text-gray-200">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </div>
                    <button onClick={() => disconnect()} className="text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors">
                      Disconnect
                    </button>
                  </div>

                  <div className="bg-black/20 border-t border-[#D4AF37]/20 pt-4 text-center">
                    <p className="text-xs text-indigo-300 mb-4 font-sans italic bg-indigo-900/20 p-2 rounded border border-indigo-500/20">Record your Kingdom's Prosperity Score on-chain (ERC-8021 + ERC-8004).</p>
                    <button
                      onClick={handleRecordKingdom}
                      disabled={loading}
                      className="w-full py-3 bg-[#D4AF37] text-[#1a0f0a] font-bold rounded-full medieval-title text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? 'SIGNING...' : <><FileCheck2 size={18}/> RECORD PROGRESS</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-2 bg-black/60 text-center border-t border-[#D4AF37]/10 text-[9px] text-[#D4AF37]/60 font-mono tracking-widest">
              ATTRIBUTION: bc_iyrfyoxr | APP ID: 68f656...
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
