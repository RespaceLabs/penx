'use client'

import { useEffect } from 'react'
import { Space } from '@/domains/Space'
import { spaceAbi } from '@/lib/abi'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'
import { useSpace } from './useSpace'

export const chainSpaceAtom = atom<Space>({} as Space)

export function useChainSpace() {
  const [space, setSpace] = useAtom(chainSpaceAtom)
  return {
    space,
    setSpace,
  }
}

export function useQueryChainSpace() {
  const { space } = useSpace()

  const { data, ...rest } = useReadContract({
    address: space?.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'getSpaceInfo',
    query: { enabled: !!space?.spaceAddress },
  })

  const { data: res } = useReadContracts({
    contracts: [
      {
        address: space?.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'getSpaceInfo',
      },
      {
        address: space?.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'getPlan',
        args: [0],
      },
    ],
    query: { enabled: !!space?.spaceAddress },
  })

  useEffect(() => {
    if (typeof res === 'undefined' || !Array.isArray(res)) return
    if (res) {
      store.set(
        chainSpaceAtom,
        new Space(res[0].result as any, res[1].result as any),
      )
    }
  }, [res])

  return { data, ...rest }
}
