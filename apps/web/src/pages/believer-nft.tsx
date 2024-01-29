import { WalletConnectProvider } from '@penx/wagmi'
import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'
import { ClientOnly } from '~/components/ClientOnly'

function PageBelieverNFT() {
  return (
    <ClientOnly>
      <WalletConnectProvider>
        <BelieverNFT />
      </WalletConnectProvider>
    </ClientOnly>
  )
}

export default PageBelieverNFT
