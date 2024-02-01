import { Box } from '@fower/react'
import { useAccount, useContractRead } from 'wagmi'
import { daoVaultAbi, penxPointAbi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'
import { GitHubAuthButton } from './GitHubAuthButton'

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

export function TaskProfile() {
  const { isConnected, address } = useAccount()

  return (
    <Box mt10 toCenterY gap2 bgGray100 rounded2XL h-200>
      <GitHubAuthButton />
      <VaultBalance></VaultBalance>
      {isConnected && <PointBalance></PointBalance>}
    </Box>
  )
}
