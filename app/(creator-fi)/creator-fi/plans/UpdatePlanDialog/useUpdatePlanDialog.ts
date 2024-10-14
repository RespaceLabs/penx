import { Plan } from '@/app/(creator-fi)/domains/Plan'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  plan: Plan
}

const updatePlanDialogAtom = atom<State>({
  isOpen: false,
  plan: null as any,
} as State)

export function useUpdatePlanDialog() {
  const [state, setState] = useAtom(updatePlanDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
