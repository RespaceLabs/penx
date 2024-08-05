import { useAddress } from '@/hooks/useAddress'
import { remirrorTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'

export function useRemirrorBalance() {
  const address = useAddress()
  return useReadContract({
    address: addressMap.RemirrorToken,
    abi: remirrorTokenAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
