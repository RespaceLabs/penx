import { Box } from '@fower/react'
import { Gem } from 'lucide-react'
import { useAccount, useContractRead } from 'wagmi'
import { daoVaultAbi, penxPointAbi } from '@penx/abi'
import { Logo } from '@penx/app'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'
import { DisconnectButton } from '../DisconnectButton'
import { WalletConnectButton } from '../WalletConnectButton'
import { TaskFilter } from './TaskFilter'
import { TaskList } from './TaskList'

function VaultBalance() {
  const { data } = useContractRead({
    address: addressMap.DaoVault,
    abi: daoVaultAbi,
    functionName: 'getBalance',
  })
  return <Box>Vault balance: {!!data && precision.toTokenDecimal(data)}</Box>
}

function PointBalance() {
  const { address } = useAccount()
  console.log('=======address:', address)

  const { data, isLoading, error } = useContractRead({
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
