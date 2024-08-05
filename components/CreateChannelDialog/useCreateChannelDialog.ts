import { atom, useAtom } from 'jotai'

const createChannelDialogAtom = atom<boolean>(false)
export function useCreateChannelDialog() {
  const [isOpen, setIsOpen] = useAtom(createChannelDialogAtom)
  return { isOpen, setIsOpen }
}
