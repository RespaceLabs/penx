import { atom, useAtom } from 'jotai'

const PaletteDrawerAtom = atom(false)

export function usePaletteDrawer() {
  const [isOpen, setIsOpen] = useAtom(PaletteDrawerAtom)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
