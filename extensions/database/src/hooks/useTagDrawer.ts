import { atom, useAtom } from 'jotai'
import { Path } from 'slate'

interface TagDrawerState {
  isOpen: boolean
  databaseId: string
  path: Path
}

const tagDrawerAtom = atom<TagDrawerState>({
  isOpen: false,
  databaseId: '',
  path: [] as Path,
})

export function useTagDrawer() {
  const [value, setValue] = useAtom(tagDrawerAtom)
  return {
    isOpen: value.isOpen,
    databaseId: value.databaseId,
    path: value.path,
    open: (data: Partial<TagDrawerState>) =>
      setValue({
        ...value,
        isOpen: true,
        ...data,
      }),
    close: () => setValue({ ...value, isOpen: false }),
  }
}
