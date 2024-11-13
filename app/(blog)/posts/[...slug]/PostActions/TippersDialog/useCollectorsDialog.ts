import { atom, useAtom } from 'jotai'

const tippersAtom = atom(false)

export function useTippersDialog() {
  const [isOpen, setIsOpen] = useAtom(tippersAtom)
  return { isOpen, setIsOpen }
}
