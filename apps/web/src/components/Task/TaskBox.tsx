import { Box } from '@fower/react'
import { Gem } from 'lucide-react'
import { daoVaultAbi, penxPointAbi } from '@penx/abi'
import { DisconnectButton, Logo } from '@penx/app'
import { precision } from '@penx/math'
import {
  addressMap,
  useAccount,
  useReadContract,
  WalletConnectButton,
} from '@penx/wagmi'
import { TaskFilter } from './TaskFilter'
import { TaskList } from './TaskList'

function VaultBalance() {
  const { data } = useReadContract({
    address: addressMap.DaoVault,
    abi: daoVaultAbi,
    functionName: 'getBalance',
  })
  return <Box>Vault balance: {!!data && precision.toTokenDecimal(data)}</Box>
}

function PointBalance() {
  const { address } = useAccount()
  console.log('=======address:', address)

  const { data, isLoading, error } = useReadContract({
    address: addressMap.PenxPoint,
    abi: penxPointAbi,
    functionName: 'balanceOf',
    args: [address!],
  })

  console.log('======balanceOf==data:', data, 'error:', error)
  if (isLoading) return null

  return <Box>Point balance: {precision.toTokenDecimal(data!)}</Box>
}

export function TaskBox() {
  const { isConnected } = useAccount()

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
          {!isConnected && <WalletConnectButton />}
          <DisconnectButton />
        </Box>
      </Box>

      <VaultBalance></VaultBalance>
      {isConnected && <PointBalance></PointBalance>}

      <Box mt10>
        <TaskFilter />
      </Box>
      <TaskList />
    </Box>
  )
}
