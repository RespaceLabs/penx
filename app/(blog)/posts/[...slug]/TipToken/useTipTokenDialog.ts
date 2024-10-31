import { atom, useAtom } from 'jotai'

interface State {
  isLoading: boolean
  isOpen: boolean
}

const tipTokenDialogAtom = atom<State>({
  isLoading: false,
  isOpen: false,
})

export function useTipTokenDialog() {
  const [state, setState] = useAtom(tipTokenDialogAtom)
  return {
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    setIsOpen: (isOpen: boolean) => setState((prev) => ({ ...prev, isOpen })),
    setIsLoading: (isLoading: boolean) =>
      setState((prev) => ({ ...prev, isLoading })),
    setState,
  }
}
