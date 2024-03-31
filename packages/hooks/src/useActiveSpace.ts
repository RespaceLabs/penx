import { useAtomValue } from 'jotai'
import { Space } from '@penx/model'
import { activeSpaceAtom } from '@penx/store'

export function useActiveSpace() {
  const space = useAtomValue(activeSpaceAtom)
  ;(window as any).__space = space

  return {
    activeSpace: new Space(space),
  }
}
