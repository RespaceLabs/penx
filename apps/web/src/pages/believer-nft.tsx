import { WalletConnectProvider } from '@penx/wagmi'
import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'

function PageBelieverNFT() {
  return (
    <WalletConnectProvider>
      <BelieverNFT />
    </WalletConnectProvider>
  )
}

export default PageBelieverNFT
