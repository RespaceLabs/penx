import { useEffect } from 'react'
import { Space } from '@/app/(creator-fi)/domains/Space'
import { RESPACE_BASE_URI } from '@/lib/constants'
import { getSpaceId } from '@/lib/getSpaceId'
import { SpaceType } from '@/lib/types'
import { store } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import ky from 'ky'

export const spaceAtom = atom<Space>(null as any as Space)

export function useSpace() {
  const [space, setSpace] = useAtom(spaceAtom)
  return {
    space,
    setSpace,
  }
}

export function useQuerySpace() {
  const spaceId = getSpaceId()

  const { data, ...rest } = useQuery({
    queryKey: ['space'],
    queryFn: async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${spaceId}`)
        .json<SpaceType>()
      return response
    },
    enabled: !!spaceId,
  })

  useEffect(() => {
    if (data) {
      console.log('=====data>>>:', data)
      store.set(spaceAtom, new Space(data))
    }
  }, [data])
  return { data, ...rest }
}
