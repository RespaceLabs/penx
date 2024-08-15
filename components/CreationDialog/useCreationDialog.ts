import { atom, useAtom } from 'jotai'

const creationDialogAtom = atom<boolean>(false)

export function useCreationDialog() {
  const [isOpen, setIsOpen] = useAtom(creationDialogAtom)
  return { isOpen, setIsOpen }
}
