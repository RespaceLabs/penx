import { RouterOutputs } from '@/server/_app'
import { atom, useAtom } from 'jotai'

const giveShareDialogAtom = atom({
  contributor:
    null as any as RouterOutputs['contributor']['listBySpaceId']['0'],
  isOpen: false,
})

export function useGiveShareDialog() {
  const [state, setState] = useAtom(giveShareDialogAtom)
  return {
    ...state,
    setState,
    setIsOpen: (isOpen: boolean) => setState((s) => ({ ...s, isOpen })),
  }
}
