import { useAtomValue } from 'jotai'
import { Space } from '@penx/model'
import { spacesAtom } from '@penx/store'

export function useSpaces() {
  const spaces = useAtomValue(spacesAtom)
  function getSpace(spaceId: string) {
    const space = spaces.find((s) => s.id === spaceId)!
    return new Space(space)
  }
  return {
    spaces,
    getSpace,
  }
}
