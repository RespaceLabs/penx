import { api } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'
import { postsAtom } from './usePosts'
import { spaceIdAtom, useSpaceId } from './useSpaceId'

type Space = RouterOutputs['space']['mySpaces']['0']

export const spacesAtom = atom<Space[]>([])

export function useSpaces() {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  const { spaceId } = useSpaceId()
  return {
    spaces,
    space: spaces.find((s) => s.id === spaceId) || spaces[0],
    setSpaces,
  }
}

export async function refetchSpaces() {
  const spaces = await api.space.mySpaces.query()
  if (spaces.length) {
    const posts = await api.post.listBySpaceId.query(spaces[0].id)
    store.set(postsAtom, posts)
  } else {
    store.set(postsAtom, [])
  }
  store.set(spacesAtom, spaces)
  store.set(spaceIdAtom, spaces[0]?.id)
}

export function updateSpaceById(id: string, data: Partial<Space>) {
  const spaces = store.get(spacesAtom)
  store.set(
    spacesAtom,
    spaces.map((space) => {
      if (space.id === id) {
        return { ...space, ...data }
      }
      return space
    }),
  )
}
