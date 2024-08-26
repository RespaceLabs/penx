import { RouterOutputs } from '@/server/_app'
import { atom, useAtom } from 'jotai'

const publishThemeDialog = atom({
  theme: null as any as RouterOutputs['theme']['listBySpaceId']['0'],
  isOpen: false,
})

export function usePublishThemeDialog() {
  const [state, setState] = useAtom(publishThemeDialog)
  return {
    ...state,
    setState,
    setIsOpen: (isOpen: boolean) => setState((s) => ({ ...s, isOpen })),
  }
}
