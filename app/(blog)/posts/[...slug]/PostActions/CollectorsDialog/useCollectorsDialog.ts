import { atom, useAtom } from 'jotai'

const collectorsAtom = atom(false)

export function useCollectorsDialog() {
  const [isOpen, setIsOpen] = useAtom(collectorsAtom)
  return { isOpen, setIsOpen }
}
