import { useEffect } from 'react'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'

export const usdcBalanceAtom = atom<bigint>(BigInt(0))

export function useUsdcBalance() {
  const [value, setValue] = useAtom(usdcBalanceAtom)
  return {
    value,
    setValue,
    decimal: precision.toDecimal(value, 6),
  }
}

export function useQueryUsdcBalance() {
  const address = useAddress()
  const res = useReadContract({
    address: addressMap.USDC,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  useEffect(() => {
    if (typeof res.data !== 'undefined') {
      store.set(usdcBalanceAtom, res.data!)
    }
  }, [res.data])
  return res
}
