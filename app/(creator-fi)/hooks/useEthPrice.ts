import { useEffect } from 'react'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import ky from 'ky'
import { RESPACE_BASE_URI } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

interface EthPriceResponse {
  price: number
}

export const ethPriceAtom = atom<number>(0 as number)

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useAtom(ethPriceAtom)
  return { ethPrice, setEthPrice }
}

export function useQueryEthPrice() {
  const { data, ...rest } = useQuery({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + '/api/get-eth-price')
        .json<EthPriceResponse>()
      return response
    },
  })

  useEffect(() => {
    if (typeof data !== 'undefined') {
      store.set(ethPriceAtom, data.price)
    }
  }, [data])
  return { data, ...rest }
}
