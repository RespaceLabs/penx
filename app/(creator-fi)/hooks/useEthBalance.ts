import { useEffect } from 'react'
import { EthBalance } from '@/app/(creator-fi)/domains/EthBalance'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { useBalance } from 'wagmi'
import { useAddress } from './useAddress'

export const ethBalanceAtom = atom<EthBalance>({} as EthBalance)

export function useEthBalance() {
  const [ethBalance, setEthBalance] = useAtom(ethBalanceAtom)
  return { ethBalance, setEthBalance }
}

export function useQueryEthBalance() {
  const address = useAddress()
  const res = useBalance({ address })

  useEffect(() => {
    if (typeof res.data !== 'undefined') {
      store.set(ethBalanceAtom, new EthBalance(res.data.value))
    }
  }, [res.data])
  return res
}
