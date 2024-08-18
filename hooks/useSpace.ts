import { RouterOutputs } from '@/server/_app'
import { atom, useAtom } from 'jotai'

export type Space = RouterOutputs['space']['mySpaces']['0']

type State = {
  space: Space
  isLoading: boolean
}

export const spaceAtom = atom<State>({
  space: null as any,
  isLoading: false,
} as State)

export function useSpace() {
  const [state, setState] = useAtom(spaceAtom)
  return {
    ...state,
    setState,
  }
}
