'use client'

import { useEffect } from 'react'
import { Space } from '@/domains/Space'
import { spaceAbi } from '@/lib/abi'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useSpaces } from './useSpaces'

export const chainSpaceAtom = atom<Space>({} as Space)

export function useChainSpace() {
  const [space, setSpace] = useAtom(chainSpaceAtom)
  return {
    space,
    setSpace,
  }
}

export function useQueryChainSpace() {
  const { space } = useSpaces()
  const { data, ...rest } = useReadContract({
    address: space.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'getSpaceInfo',
    query: { enabled: !!space?.spaceAddress },
  })

  useEffect(() => {
    if (typeof data === 'undefined') return
    if (data) {
      console.log('data========:', data)
      store.set(chainSpaceAtom, new Space(data))
    }
  }, [data])

  return { data, ...rest }
}
