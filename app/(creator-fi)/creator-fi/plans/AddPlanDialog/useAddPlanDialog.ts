import { atom, useAtom } from 'jotai'

const addPlanDialogAtom = atom<boolean>(false)

export function useAddPlanDialog() {
  const [isOpen, setIsOpen] = useAtom(addPlanDialogAtom)
  return { isOpen, setIsOpen }
}
