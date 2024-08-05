import { atom, useAtom } from 'jotai'

const tradeDialogAtom = atom<boolean>(false)

export function useTradeDialog() {
  const [isOpen, setIsOpen] = useAtom(tradeDialogAtom)
  return { isOpen, setIsOpen }
}
