'use client'

import { useEffect } from 'react'
import { Creation } from '@/domains/Creation'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { useReadContract } from 'wagmi'

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

  useEffect(() => {
    if (data) {
      store.set(creationAtom, new Creation(data as any))
    }
  }, [data])

  return { data, ...rest }
}
