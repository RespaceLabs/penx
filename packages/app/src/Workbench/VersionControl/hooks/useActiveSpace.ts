import { atom, useAtom } from 'jotai'
import { Space } from '@penx/model'

const spaceAtom = atom<Space>(null as any as Space)

export function useActiveSpace() {
  const [space, setSpace] = useAtom(spaceAtom)
  return { space, setSpace }
}
