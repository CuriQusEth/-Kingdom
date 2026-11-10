import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// Fallback WalletConnect project ID for development
const projectId = 'b56e4a5a594dcaa865ed06fb94d03874';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})
