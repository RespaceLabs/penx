import { useEffect } from 'react'
import { Space } from '@/app/(creator-fi)/domains/Space'
import ky from 'ky'
import { RESPACE_BASE_URI, SPACE_ID } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { SpaceType } from '@/lib/types'

export const spaceAtom = atom<Space>(null as any as Space)

export function useSpace() {
  const [space, setSpace] = useAtom(spaceAtom)
  return {
    space,
    setSpace,
  }
}

export function useQuerySpace() {
  const { data, ...rest } = useQuery({
    queryKey: ['space'],
    queryFn: async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${SPACE_ID}`)
        .json<SpaceType>()
      return response
    },
  })

  useEffect(() => {
    if (data) {
      console.log('=====data>>>:', data)
      store.set(spaceAtom, new Space(data))
    }
  }, [data])
  return { data, ...rest }
}
