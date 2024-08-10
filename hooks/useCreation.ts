'use client'

import { useEffect } from 'react'
import { Creation } from '@/domains/Creation'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { useReadContract } from 'wagmi'
import { useSupply } from './useSupply'

export const creationAtom = atom<Creation>({} as Creation)

export function useCreation() {
  const [creation, setCreation] = useAtom(creationAtom)
  return { creation, setCreation }
}

export function useQueryCreation(creationId: string) {
  const { data, ...rest } = useReadContract({
    address: addressMap.IndieX,
    abi: indieXAbi,
    functionName: 'getCreation',
    args: [BigInt(creationId)],
  })

  const { data: supply } = useSupply(BigInt(creationId))

  useEffect(() => {
    if (typeof supply === 'undefined') return
    if (typeof data === 'undefined') return
    if (data) {
      store.set(creationAtom, new Creation(data as any, supply))
    }
  }, [data])

  return { data, ...rest }
}
