import { atom, useAtom } from 'jotai'

const buyDialogAtom = atom<boolean>(false)

export function useBuyDialog() {
  const [isOpen, setIsOpen] = useAtom(buyDialogAtom)
  return { isOpen, setIsOpen }
}
