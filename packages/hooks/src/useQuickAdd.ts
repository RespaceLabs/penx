import { atom, useAtom } from 'jotai'

const quickAddAtom = atom(false)

export function useQuickAdd() {
  const [isOpen, setIsOpen] = useAtom(quickAddAtom)
  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
