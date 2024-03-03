import { Box } from '@fower/react'
import { Gem, Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'
import { DisconnectButton } from '../DisconnectButton'
import { Logo } from '../Logo'
import { WalletConnectButton } from '../WalletConnectButton'
import { TaskFilter } from './TaskFilter'
import { TaskHeader } from './TaskHeader'
import { TaskList } from './TaskList'

export function TaskBox() {
  const { isConnected, address } = useAccount()

  return (
    <Box maxW-1120 mx-auto p5 column>
      <Box toBetween toCenterY>
        <Box toCenterY gap2>
          <Box toCenterY gap2>
            <Box white bgBlack square10 toCenter roundedFull>
              <Gem size={24}></Gem>
            </Box>
            <Box text5XL fontBold>
              Bounty Task
            </Box>
          </Box>
          <Box opacity-40 bgGray300 roundedFull py1 px2 mt2>
            <Logo size={20} />
          </Box>
        </Box>

        <Box>
          {!isConnected && (
            <WalletConnectButton
              size={56}
              rounded2XL
              colorScheme="white"
              toBetween
            >
              <Wallet />
              <Box column gap1>
                <Box textBase fontSemibold>
                  Login with Wallet
                </Box>
                <Box gray800 textXS fontLight>
                  For web3 users and builders
                </Box>
              </Box>
            </WalletConnectButton>
          )}

          <DisconnectButton />
        </Box>
      </Box>

      <TaskHeader></TaskHeader>

      <Box mt10>
        <TaskFilter />
      </Box>
      <TaskList />
    </Box>
  )
}
