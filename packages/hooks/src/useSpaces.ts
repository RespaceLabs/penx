import { useAtomValue } from 'jotai'
import { spacesAtom } from '@penx/store'

export function useSpaces() {
  const spaces = useAtomValue(spacesAtom)
  return {
    spaces,
  }
}
