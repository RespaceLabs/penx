import { atom, useAtom } from 'jotai'

const mintPostDialogAtom = atom<boolean>(false)

export function useMintPostDialog() {
  const [isOpen, setIsOpen] = useAtom(mintPostDialogAtom)
  return { isOpen, setIsOpen }
}
