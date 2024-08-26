import { atom, useAtom } from 'jotai'

const addThemeDialog = atom<boolean>(false)

export function useAddThemeDialog() {
  const [isOpen, setIsOpen] = useAtom(addThemeDialog)
  return { isOpen, setIsOpen }
}
