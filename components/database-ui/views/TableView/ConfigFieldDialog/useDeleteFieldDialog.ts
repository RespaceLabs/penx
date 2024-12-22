'use client'

import { atom, useAtom } from 'jotai'
import { Field } from '@/server/db/schema'

type State = {
  isOpen: boolean
  field: Field
}

const configFieldDialogAtom = atom<State>({
  isOpen: false,
  field: null as any,
} as State)

export function useConfigFieldDialog() {
  const [state, setState] = useAtom(configFieldDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
