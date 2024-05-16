import { atom, useAtom } from 'jotai'

type Position = 'ROOT' | 'COMMAND_APP'

export const positionAtom = atom<Position>('ROOT')

export function useCommandPosition() {
  const [position, setPosition] = useAtom(positionAtom)
  return {
    isRoot: position === 'ROOT',
    isCommandApp: position === 'COMMAND_APP',
    position,
    setPosition,
  }
}
