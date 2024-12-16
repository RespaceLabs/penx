import { Address } from 'viem'
import { useAccount } from 'wagmi'

export function useAddress() {
  const { address } = useAccount()
  return (address || '') as Address
}
