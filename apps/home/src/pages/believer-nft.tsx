import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'
import { ClientOnly } from '~/components/ClientOnly'
import { WalletConnectProvider } from '~/components/WalletConnectProvider'

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
