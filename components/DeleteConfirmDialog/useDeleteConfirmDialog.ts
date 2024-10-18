import { atom, useAtom } from 'jotai'

const deleteConfirmDialogAtom = atom<boolean>(false)

export function useDeleteConfirmDialog() {
  const [isOpen, setIsOpen] = useAtom(deleteConfirmDialogAtom)
  return { isOpen, setIsOpen }
}
