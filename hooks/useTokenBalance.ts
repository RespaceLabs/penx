import { EthBalance } from '@/domains/EthBalance'
import { spaceAbi } from '@/lib/abi'
import { atom } from 'jotai'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'
import { useSpaces } from './useSpaces'

export const ethBalanceAtom = atom<EthBalance>({} as EthBalance)

export function useTokenBalance() {
  const { space } = useSpaces()
  const address = useAddress()
  const res = useReadContract({
    address: space.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  return res
}
