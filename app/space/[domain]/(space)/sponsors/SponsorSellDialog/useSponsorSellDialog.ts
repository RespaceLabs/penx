import { atom, useAtom } from 'jotai'

const sellDialogAtom = atom<boolean>(false)

export function useSponsorSellDialog() {
  const [isOpen, setIsOpen] = useAtom(sellDialogAtom)
  return { isOpen, setIsOpen }
}
