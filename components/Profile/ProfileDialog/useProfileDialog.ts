import { atom, useAtom } from 'jotai'

const profileDialog = atom<boolean>(false)

export function useProfileDialog() {
  const [isOpen, setIsOpen] = useAtom(profileDialog)
  return { isOpen, setIsOpen }
}
