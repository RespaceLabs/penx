import { SELECTED_SPACE } from '@/lib/constants'
import { atom, useAtom } from 'jotai'

export const spaceIdAtom = atom<string>(
  localStorage.getItem(SELECTED_SPACE) || '',
)

export function useSpaceId() {
  const [spaceId, setSpaceId] = useAtom(spaceIdAtom)
  return { spaceId, setSpaceId }
}
