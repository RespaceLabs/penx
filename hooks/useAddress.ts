import { useSession } from 'next-auth/react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export function useAddress() {
  // const { address } =  useAccount()
  const { data } = useSession()

  return (data?.address || '') as Address
}
