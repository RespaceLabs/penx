import { SpaceOnEvent } from '@/lib/types'
import { store } from '@/store'
import { atom, useAtom } from 'jotai'

export const spacesAtom = atom<SpaceOnEvent[]>([])

export function useSpaces() {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  return {
    spaces,
    setSpaces,
  }
}

export async function refetchSpaces() {
  // TODO:
  // const spaces = await api.space.mySpaces.query()
  // store.set(spacesAtom, spaces)
  // store.set(spaceIdAtom, spaces[0]?.id)
}

export function updateSpaceById(id: string, data: Partial<SpaceOnEvent>) {
  const spaces = store.get(spacesAtom)
  store.set(
    spacesAtom,
    spaces.map((space) => {
      if (space.id === id) {
        return { ...space, ...data }
      }
      return space
    })
  )
}
