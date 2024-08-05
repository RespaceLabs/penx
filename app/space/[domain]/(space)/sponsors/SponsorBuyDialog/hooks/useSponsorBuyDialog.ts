import { atom, useAtom } from 'jotai'

const buyDialogAtom = atom<boolean>(false)

export function useSponsorBuyDialog() {
  const [isOpen, setIsOpen] = useAtom(buyDialogAtom)
  return { isOpen, setIsOpen }
}
