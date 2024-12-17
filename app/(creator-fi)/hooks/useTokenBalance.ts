import { EthBalance } from '@/app/(creator-fi)/domains/EthBalance'
import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { atom } from 'jotai'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'

export const ethBalanceAtom = atom<EthBalance>({} as EthBalance)

export function useTokenBalance() {
  const space = useSpaceContext()
  const address = useAddress()
  const res = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  return res
}
