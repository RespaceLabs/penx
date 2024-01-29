import { WalletConnectProvider } from '@penx/wagmi'
import { BelieverNFT } from '~/components/BelieverNFT/BelieverNFT'
import { TaskBox } from '~/components/Task/TaskBox'

function PageTasks() {
  return (
    <WalletConnectProvider>
      <TaskBox />
    </WalletConnectProvider>
  )
}

export default PageTasks
