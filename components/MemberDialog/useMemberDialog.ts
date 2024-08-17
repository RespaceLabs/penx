import { atom, useAtom } from 'jotai'

const memberDialogAtom = atom<boolean>(false)

export function useMemberDialog() {
  const [isOpen, setIsOpen] = useAtom(memberDialogAtom)
  return { isOpen, setIsOpen }
}
