import { atom, useAtom } from 'jotai'

const priceDialogAtom = atom<boolean>(false)
export function useUpdatePriceDialog() {
  const [isOpen, setIsOpen] = useAtom(priceDialogAtom)
  return { isOpen, setIsOpen }
}
