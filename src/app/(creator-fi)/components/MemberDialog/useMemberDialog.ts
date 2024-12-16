import { Plan } from '@/app/(creator-fi)/domains/Plan'
import { Subscription } from '@/app/(creator-fi)/domains/Subscription'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  plan: Plan
  subscription: Subscription
}

const memberDialogAtom = atom<State>({
  isOpen: false,
  plan: null as any,
  subscription: null as any,
} as State)

export function useMemberDialog() {
  const [state, setState] = useAtom(memberDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
