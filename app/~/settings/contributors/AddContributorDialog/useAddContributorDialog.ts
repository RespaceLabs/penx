import { atom, useAtom } from 'jotai'

const addContributorDialog = atom<boolean>(false)

export function useAddContributorDialog() {
  const [isOpen, setIsOpen] = useAtom(addContributorDialog)
  return { isOpen, setIsOpen }
}
