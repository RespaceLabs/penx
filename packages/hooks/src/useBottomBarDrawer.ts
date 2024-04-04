import { atom, useAtom } from 'jotai'

const bottomBarDrawerAtom = atom(false)

export function useBottomBarDrawer() {
  const [isOpen, setIsOpen] = useAtom(bottomBarDrawerAtom)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
