import { EthBalance } from '@/app/(creator-fi)/domains/EthBalance'
import { spaceAbi } from '@/lib/abi'
import { atom } from 'jotai'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'
import { useSpace } from './useSpace'

export const ethBalanceAtom = atom<EthBalance>({} as EthBalance)

export function useTokenBalance() {
  const { space } = useSpace()
  const address = useAddress()
  const res = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  return res
}
