import { atom, useAtom } from 'jotai'

export const spaceIdAtom = atom<string>('')

export function useSpaceId() {
  const [spaceId, setSpaceId] = useAtom(spaceIdAtom)
  return { spaceId, setSpaceId }
}
