import { atom, useAtom } from 'jotai'

const sidebarSheet = atom<boolean>(false)

export function useSidebarSheet() {
  const [isOpen, setIsOpen] = useAtom(sidebarSheet)
  return { isOpen, setIsOpen }
}
