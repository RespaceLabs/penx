import { atom, useAtom } from 'jotai'

const createSpaceDialogAtom = atom<boolean>(false)
export function useCreateSpaceDialog() {
  const [isOpen, setIsOpen] = useAtom(createSpaceDialogAtom)
  return { isOpen, setIsOpen }
}
