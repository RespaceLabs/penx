import { WalletConnectProvider } from '@penx/wagmi'
import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'

function PageTasks() {
  return (
    <WalletConnectProvider>
      <BelieverNFT />
    </WalletConnectProvider>
  )
}

export default PageTasks
